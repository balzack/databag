package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func RemoveLabel(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  params := mux.Vars(r)
  labelId := params["labelId"]

  var slot store.LabelSlot
  if err := store.DB.Preload("Label.LabelData").Preload("Label.Groups.Cards").Where("account_id = ? AND label_slot_id = ?", account.ID, labelId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  groups := slot.Label.Groups
  notify := map[string]*store.Card{}

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Model(slot.Label).Association("Groups").Clear(); res != nil {
      return res
    }
    if res := tx.Delete(&slot.Label.LabelData).Error; res != nil {
      return res
    }
    if res := tx.Delete(&slot.Label).Error; res != nil {
      return res
    }
    for _, group := range groups {
      for _, card := range group.Cards {
        if res := tx.Model(&card).Update("ViewRevision", card.ViewRevision + 1).Error; res != nil {
          return res
        }
        notify[card.Guid] = &card
      }
    }

    slot.LabelID = 0
    slot.Label = nil
    slot.Revision = account.LabelRevision + 1
    if res := tx.Save(&slot).Error; res != nil {
      return res
    }
    if res :=  tx.Model(&account).Updates(store.Account{LabelRevision: account.LabelRevision + 1}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  for _, card := range notify {
    SetContactViewNotification(account, card)
  }
  SetStatus(account)
  WriteResponse(w, nil)
}

