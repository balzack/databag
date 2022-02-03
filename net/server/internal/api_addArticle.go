package databag

import (
  "time"
  "errors"
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

  var articleAccess ArticleAccess
  if err := ParseRequest(r, w, &articleAccess); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  var groups []store.Group
  if err := store.DB.Where("group_id IN ?", articleAccess.Groups).Find(&groups).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var labelSlots []store.LabelSlot
  if err := store.DB.Preload("Label").Where("label_slot_id IN ?", articleAccess.Labels).Find(&labelSlots).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  var labels []store.Label
  for _, slot := range labelSlots {
    if slot.Label != nil {
      labels = append(labels, *slot.Label)
    }
  }

  // save data and apply transaction
  var slot *store.ArticleSlot
  err = store.DB.Transaction(func(tx *gorm.DB) error {

    article := &store.Article{
      Status: APP_ARTICLEUNCONFIRMED,
      TagUpdated: time.Now().Unix(),
      TagRevision: 1,
      TagCount: 0,
      Groups: groups,
      Labels: labels,
    };
    if res := tx.Save(article).Error; res != nil {
      return res;
    }

    if res := tx.Where("article_id = 0 AND account_id = ?", account.ID).First(&slot).Error; res != nil {
      if errors.Is(res, gorm.ErrRecordNotFound) {
        slot = &store.ArticleSlot{
          ArticleSlotId: uuid.New().String(),
          AccountID: account.ID,
          Revision: 1,
          ArticleID: article.ID,
          Article: article,
        }
        if ret := tx.Save(slot).Error; ret != nil {
          return ret;
        }
      } else {
        return res
      }
    }
    if ret := tx.Model(slot).Update("article_id", article.ID).Error; ret != nil {
      return ret;
    }
    if ret := tx.Preload("Article.Labels.Groups").Where("id = ?", article.ID).First(slot).Error; ret != nil {
      return ret;
    }
    if ret := tx.Model(&account).Update("content_revision", account.ContentRevision + 1).Error; ret != nil {
      return ret
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetContentNotification(account)
  SetStatus(account)
  WriteResponse(w, getArticleModel(slot, false, true))
}


