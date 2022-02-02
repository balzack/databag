package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func RemoveArticle(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  params := mux.Vars(r)
  articleId := params["articleId"]

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    var article store.Article
    if res := store.DB.Preload("ArticleData").Where("account_id = ? AND article_id = ?", account.ID, articleId).First(&article).Error; res != nil {
      return res
    }
    if article.ArticleData == nil {
      return nil
    }
    if res := tx.Delete(article.ArticleData).Error; res != nil {
      return res
    }
    article.ArticleDataID = 0
    article.ArticleData = nil
    if res := tx.Save(&article).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("content_revision", account.ContentRevision).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }

  SetContentNotification(account)
  SetStatus(account)
  WriteResponse(w, nil)
}

