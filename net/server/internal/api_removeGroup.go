package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func RemoveGroup(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  params := mux.Vars(r)
  groupId := params["groupId"]

  var group store.Group
  if err := store.DB.Preload("GroupData").Where("account_id = ? AND group_id = ?", account.ID, groupId).First(&group).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Delete(&group.GroupData).Error; res != nil {
      return res
    }
    if res := tx.Delete(&group).Error; res != nil {
      return res
    }
    if res :=  tx.Model(&account).Updates(store.Account{ViewRevision: account.ViewRevision + 1, GroupRevision: account.GroupRevision + 1}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  SetViewNotification(account)
  WriteResponse(w, nil)
}

