package databag

import (
  "time"
  "errors"
  "net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func SetCloseMessage(w http.ResponseWriter, r *http.Request) {

  var message DataMessage
  if err := ParseRequest(r, w, &message); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  var disconnect Disconnect
  guid, messageType, ts, err := ReadDataMessage(&message, &disconnect)
  if messageType != APP_MSGDISCONNECT || err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }
  if ts + APP_CONNECTEXPIRE < time.Now().Unix() {
    ErrResponse(w, http.StatusBadRequest, errors.New("message has expired"))
    return
  }

  // load referenced account
  var account store.Account
  if err := store.DB.Where("guid = ?", disconnect.Contact).First(&account).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }

  // see if card exists
  var card store.Card
  if err := store.DB.Preload("CardSlot").Where("account_id = ? AND guid = ?", account.Guid, guid).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      WriteResponse(w, nil)
    }
    return
  }

  slot := card.CardSlot
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if card.Status == APP_CARDPENDING {
      if res := tx.Model(&slot).Update("card_id", 0).Error; res != nil {
        return res
      }
      if res := tx.Delete(&card).Error; res != nil {
        return res
      }
    } else {
      if res := tx.Model(&card).Update("status", APP_CARDCONFIRMED).Error; res != nil {
        return res
      }
    }
    if res := tx.Model(&card).Update("detail_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&slot).Update("revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(&account)
  WriteResponse(w, nil)
}

