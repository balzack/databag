package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetLabelGroup(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  groupId := params["groupId"]
  labelId := params["labelId"]

  labelSlot := &store.LabelSlot{}
  if err := store.DB.Preload("Label").Where("account_id = ? AND label_slot_id = ?", account.ID, labelId).First(&labelSlot).Error; err != nil {
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

  groupSlot := &store.GroupSlot{}
  if err := store.DB.Preload("Group.GroupSlot").Where("account_id = ? AND group_slot_id = ?", account.ID, groupId).First(&groupSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if groupSlot.Group == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty group slot"))
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {

    if res := tx.Model(labelSlot.Label).Association("Groups").Append(groupSlot.Group); res != nil {
      return res
    }

    if res := tx.Model(labelSlot).Update("revision", account.LabelRevision + 1).Error; res != nil {
      return res
    }

    if res := tx.Model(account).Update("label_revision", account.LabelRevision + 1).Error; res != nil {
      return res
    }

    if res := tx.Model(account).Update("view_revision", account.ViewRevision + 1).Error; res != nil {
      return res
    }

    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetViewNotification(account)
  SetLabelNotification(account)
  SetStatus(account)
  WriteResponse(w, getLabelModel(labelSlot, true, true))
}

