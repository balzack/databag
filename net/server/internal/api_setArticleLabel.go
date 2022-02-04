package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetArticleLabel(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  articleId := params["articleId"]
  labelId := params["labelId"]

  labelSlot := &store.LabelSlot{}
  if err := store.DB.Preload("Label.LabelSlot").Where("account_id = ? AND label_slot_id = ?", account.ID, labelId).First(&labelSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if labelSlot.Label == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty label slot"))
    return
  }

  articleSlot := &store.ArticleSlot{}
  if err := store.DB.Preload("Article.Labels.LabelSlot").Preload("Article.Groups.GroupSlot").Where("account_id = ? AND article_slot_id = ?", account.ID, articleId).First(&articleSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if articleSlot.Article == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty article slot"))
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {

    if res := tx.Model(articleSlot.Article).Association("Labels").Append(labelSlot.Label); res != nil {
      return res
    }

    if res := tx.Model(articleSlot).Update("revision", account.ContentRevision + 1).Error; res != nil {
      return res
    }

    if res := tx.Model(account).Update("content_revision", account.ContentRevision + 1).Error; res != nil {
      return res
    }

    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetContentNotification(account)
  SetStatus(account)
  WriteResponse(w, getArticleModel(articleSlot, false, true))
}
