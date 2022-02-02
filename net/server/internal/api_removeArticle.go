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
    var slot store.ArticleSlot
    if res := store.DB.Preload("Article").Where("account_id = ? AND article_slot_id = ?", account.ID, articleId).First(&slot).Error; res != nil {
      return res
    }
    if slot.Article == nil {
      return nil
    }
    if res := tx.Delete(slot.Article).Error; res != nil {
      return res
    }
    slot.ArticleID = 0
    slot.Article = nil
    if res := tx.Save(&slot).Error; res != nil {
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

