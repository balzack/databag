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
  }

  tokenType := r.Header.Get("TokenType")
  var response []*Article
  if tokenType == APP_TOKENAPP {

    account, code, err := BearerAppToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    var articles []store.Article
    if err := getAccountArticles(account, contentRevision, &articles); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    for _, article := range articles {
      response = append(response, getArticleModel(&article, false, true))
    }
  } else if tokenType == APP_TOKENCONTACT {

    card, code, err := BearerContactToken(r)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    if viewRevision != card.ViewRevision + card.Account.ViewRevision {
      contentRevision = 0
    }

    var articles []store.Article
    if err := getContactArticles(card, contentRevision, &articles); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    for _, article := range articles {
      response = append(response, getArticleModel(&article, true, isShared(&article, card.Guid)))
    }
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
  }

  WriteResponse(w, response)
}

// better if this filtering was done in gorm or sql
func isShared(article *store.Article, guid string) bool {
  if article.ArticleData == nil {
    return false
  }
  for _, label := range article.ArticleData.Labels {
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

func getAccountArticles(account *store.Account, revision int64, articles *[]store.Article) error {
  return store.DB.Preload("ArticleData.Labels.Groups").Where("account_id = ? AND revision > ?", account.ID, revision).Find(articles).Error
}

func getContactArticles(card *store.Card, revision int64, articles *[]store.Article) error {
  return store.DB.Preload("ArticleData.Labels.Groups.Cards").Where("account_id = ? AND revision > ?", card.Account.ID, revision).Find(articles).Error
}




