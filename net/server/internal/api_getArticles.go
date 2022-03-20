package databag

import (
  "strings"
  "errors"
  "strconv"
  "net/http"
  "encoding/json"
  "databag/internal/store"
)

func GetArticles(w http.ResponseWriter, r *http.Request) {
  var articleRevisionSet bool
  var articleRevision int64
  var viewRevisionSet bool
  var viewRevision int64
  var typesSet bool
  var types []string

  article := r.FormValue("articleRevision")
  if article != "" {
    var err error
    articleRevisionSet = true
    if articleRevision, err = strconv.ParseInt(article, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  view := r.FormValue("viewRevision")
  if view != "" {
    var err error
    viewRevisionSet = true
    if viewRevision, err = strconv.ParseInt(view, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  schemas := r.FormValue("types")
  if schemas != "" {
    var err error
    typesSet = true
    dec := json.NewDecoder(strings.NewReader(schemas))
    if dec.Decode(&types) != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  var response []*Article
  tokenType := ParamTokenType(r)
  if tokenType == APP_TOKENAGENT {

    account, code, err := ParamAgentToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    var slots []store.ArticleSlot
    if articleRevisionSet {
      if err := store.DB.Preload("Article").Where("account_id = ? AND revision > ?", account.ID, articleRevision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Article").Where("account_id = ? AND article_id != 0", account.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }

    for _, slot := range slots {
      if !typesSet || hasArticleType(types, slot.Article) {
        response = append(response, getArticleModel(&slot, true, true))
      }
    }

    w.Header().Set("Article-Revision", strconv.FormatInt(account.ArticleRevision, 10))

  } else if tokenType == APP_TOKENCONTACT {

    card, code, err := ParamContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    if viewRevisionSet || articleRevisionSet {
      if viewRevision != card.ViewRevision {
        ErrResponse(w, http.StatusGone, errors.New("article view has changed"))
        return
      }
    }

    account := &card.Account
    var slots []store.ArticleSlot
    if articleRevisionSet {
      if err := store.DB.Preload("Article.Groups.Cards").Where("account_id = ? AND revision > ?", account.ID, articleRevision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Article.Groups.Cards").Where("account_id = ? AND article_id != 0", account.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }

    for _, slot := range slots {
      if !typesSet || hasArticleType(types, slot.Article) {
        shared := isArticleShared(card.Guid, slot.Article)
        if articleRevisionSet {
          response = append(response, getArticleModel(&slot, shared, false))
        } else if shared {
          response = append(response, getArticleModel(&slot, true, false))
        }
      }
    }

    w.Header().Set("Article-Revision", strconv.FormatInt(account.ArticleRevision, 10))
    w.Header().Set("View-Revision", strconv.FormatInt(card.ViewRevision, 10))

  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
    return
  }

  WriteResponse(w, response)
}

func isArticleShared(guid string, article *store.Article) bool {
  if article == nil {
    return false
  }
  for _, group := range article.Groups {
    for _, card := range group.Cards {
      if guid == card.Guid {
        return true
      }
    }
  }
  return false
}

func hasArticleType(types []string, article *store.Article) bool {
  if article == nil {
    return false
  }
  for _, schema := range types {
    if schema == article.DataType {
      return true
    }
  }
  return false
}

