package databag

import (
  "errors"
  "strconv"
  "net/http"
  "databag/internal/store"
)

func GetArticles(w http.ResponseWriter, r *http.Request) {
  var res error
  var viewRevision int64
  var contentRevision int64
  var revisionSet bool

  view := r.FormValue("viewRevision")
  if view != "" {
    if viewRevision, res = strconv.ParseInt(view, 10, 64); res != nil {
      ErrResponse(w, http.StatusBadRequest, res)
      return
    }
  }
  content := r.FormValue("contentRevision")
  if content != "" {
    if contentRevision, res = strconv.ParseInt(content, 10, 64); res != nil {
      ErrResponse(w, http.StatusBadRequest, res)
      return
    }
    revisionSet = true
  }

  tokenType := r.Header.Get("TokenType")
  var response []*Article
  if tokenType == APP_TOKENAPP {

    account, code, err := BearerAppToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    var articles []store.ArticleSlot
    if err := getAccountArticles(account, contentRevision, &articles); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    for _, article := range articles {
      response = append(response, getArticleModel(&article, false, true))
    }

    w.Header().Set("Content-Revision", strconv.FormatInt(account.ContentRevision, 10))
  } else if tokenType == APP_TOKENCONTACT {

    card, code, err := BearerContactToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    if viewRevision != card.ViewRevision {
      if revisionSet {
        ErrResponse(w, http.StatusGone, errors.New("article view unavailable"))
        return
      }
    }

    var articles []store.ArticleSlot
    if err := getContactArticles(card, contentRevision, &articles); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    for _, article := range articles {
      if isArticleShared(&article, card.Guid) {
        response = append(response, getArticleModel(&article, true, true))
      } else if revisionSet {
        response = append(response, getArticleModel(&article, true, false))
      }
    }

    w.Header().Set("View-Revision", strconv.FormatInt(card.ViewRevision, 10))
    w.Header().Set("Content-Revision", strconv.FormatInt(card.Account.ContentRevision, 10))
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
  }

  WriteResponse(w, response)
}

// better if this filtering was done in gorm or sql
func isArticleShared(slot *store.ArticleSlot, guid string) bool {
  if slot.Article == nil {
    return false
  }
  for _, group := range slot.Article.Groups {
    for _, card := range group.Cards {
      if card.Guid == guid {
        return true
      }
    }
  }
  for _, label := range slot.Article.Labels {
    for _, group := range label.Groups {
      for _, card := range group.Cards {
        if card.Guid == guid {
          return true
        }
      }
    }
  }
  return false
}

func getAccountArticles(account *store.Account, revision int64, articles *[]store.ArticleSlot) error {
  return store.DB.Preload("Article.Labels.LabelSlot").Preload("Article.Groups.GroupSlot").Preload("Article.Labels.Groups.GroupSlot").Where("account_id = ? AND revision > ?", account.ID, revision).Find(articles).Error
}

func getContactArticles(card *store.Card, revision int64, articles *[]store.ArticleSlot) error {
  return store.DB.Preload("Article.Labels.LabelSlot").Preload("Article.Groups.Cards").Preload("Article.Labels.Groups.Cards").Where("account_id = ? AND revision > ?", card.Account.ID, revision).Find(articles).Error
}




