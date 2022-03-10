package databag

import (
  "net/http"
  "gorm.io/gorm"
  "github.com/google/uuid"
  "databag/internal/store"
)

func AddArticle(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var subject Subject
  if err := ParseRequest(r, w, &subject); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  slot := &store.ArticleSlot{}
  err = store.DB.Transaction(func(tx *gorm.DB) error {

    article := &store.Article{}
    article.AccountID = account.ID
    article.Data = subject.Data
    article.DataType = subject.DataType
    if res := tx.Save(article).Error; res != nil {
      return res
    }

    slot.ArticleSlotId = uuid.New().String()
    slot.AccountID = account.ID
    slot.ArticleID = article.ID
    slot.Revision = account.ArticleRevision + 1
    slot.Article = article
    if res := tx.Save(slot).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("article_revision", account.ArticleRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  WriteResponse(w, getArticleModel(slot, true, true))
}


