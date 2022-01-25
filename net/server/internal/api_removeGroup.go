package databag

import (
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

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Where("account_id = ? AND group_id = ?", account.ID, groupId).Delete(&store.Group{}).Error; res != nil {
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

  WriteResponse(w, nil)
  SetStatus(account)
  SetContentNotification(account)
}

