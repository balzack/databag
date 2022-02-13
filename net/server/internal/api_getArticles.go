package databag

import (
  "errors"
  "strconv"
  "net/http"
  "databag/internal/store"
)

func GetArticles(w http.ResponseWriter, r *http.Request) {
  var articleRevisionSet bool
  var articleRevision int64
  var viewRevisionSet bool
  var viewRevision int64

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

  var response []*Article
  tokenType := r.Header.Get("TokenType")
  if tokenType == APP_TOKENAPP {

    account, code, err := BearerAppToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    var slots []store.ArticleSlot
    if articleRevisionSet {
      if err := store.DB.Preload("Article.ArticleData").Where("account_id = ? AND revision > ?", account.ID, articleRevision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Article.ArticleData").Where("account_id = ? AND article_id != 0", account.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }

    for _, slot := range slots {
      response = append(response, getArticleModel(&slot, true))
    }

    w.Header().Set("Article-Revision", strconv.FormatInt(account.ArticleRevision, 10))

  } else if tokenType == APP_TOKENCONTACT {

    card, code, err := BearerContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    if viewRevisionSet || articleRevisionSet {
      if viewRevision != card.ViewRevision {
        ErrResponse(w, http.StatusGone, errors.New("artivle view has changed"))
        return
      }
    }

    account := &card.Account
    var slots []store.ArticleSlot
    if articleRevisionSet {
      if err := store.DB.Preload("Article.ArticleData").Where("account_id = ? AND revision > ?", account.ID, articleRevision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Article.ArticleData").Where("account_id = ? AND article_id != 0", account.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }

    for _, slot := range slots {
      response = append(response, getArticleModel(&slot, false))
    }

    w.Header().Set("Article-Revision", strconv.FormatInt(account.ArticleRevision, 10))
    w.Header().Set("View-Revision", strconv.FormatInt(card.ViewRevision, 10))

  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
    return
  }

  WriteResponse(w, response)
}

