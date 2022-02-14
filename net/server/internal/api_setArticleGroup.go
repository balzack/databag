package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetArticleGroup(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  articleId := params["articleId"]
  groupId := params["groupId"]

  // load referenced article
  var articleSlot store.ArticleSlot
  if err := store.DB.Preload("Article").Where("account_id = ? AND article_slot_id = ?", account.ID, articleId).First(&articleSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if articleSlot.Article == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("article has been deleted"))
    return
  }

  // load referenced group 
  var groupSlot store.GroupSlot
  if err := store.DB.Preload("Group.Cards").Preload("Group.GroupSlot").Where("account_id = ? AND group_slot_id = ?", account.ID, groupId).First(&groupSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if groupSlot.Group == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("group has been deleted"))
    return
  }

  // save and update contact revision
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Model(&articleSlot.Article).Association("Groups").Append(groupSlot.Group); res != nil {
      return res
    }
    if res := tx.Model(&articleSlot).Update("revision", account.ArticleRevision + 1).Error; res != nil {
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

  // notify contacts of content change
  SetStatus(account)
  for _, card := range groupSlot.Group.Cards {
    SetContactArticleNotification(account, &card)
  }

  WriteResponse(w, getArticleModel(&articleSlot, true));
}

