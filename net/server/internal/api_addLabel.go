package databag

import (
  "net/http"
  "errors"
  "gorm.io/gorm"
  "github.com/google/uuid"
  "databag/internal/store"
)

func AddLabel(w http.ResponseWriter, r *http.Request) {

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

  slot := &store.LabelSlot{}
  label := &store.Label{}
  err = store.DB.Transaction(func(tx *gorm.DB) error {

    data := &store.LabelData{
      Data: subject.Data,
    }
    if res := tx.Save(data).Error; res != nil {
      return res
    }

    label.LabelDataID = data.ID
    label.LabelData = *data
    label.DataType = subject.DataType
    if res := tx.Save(label).Error; res != nil {
      return res
    }

    if res := tx.Where("account_id = ? AND label_id = 0", account.ID).First(slot).Error; res != nil {
      if errors.Is(res, gorm.ErrRecordNotFound) {
        slot.LabelSlotId = uuid.New().String()
        slot.AccountID = account.ID
      } else {
        return res
      }
    }
    slot.LabelID = label.ID
    slot.Revision = account.LabelRevision + 1
    slot.Label = label
    if res := tx.Save(slot).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("label_revision", account.LabelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  WriteResponse(w, getLabelModel(slot, true, true))
}


