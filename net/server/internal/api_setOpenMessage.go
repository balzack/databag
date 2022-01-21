package databag

import (
  "time"
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/google/uuid"
  "databag/internal/store"
)

func SetOpenMessage(w http.ResponseWriter, r *http.Request) {

  var message DataMessage
  if err := ParseRequest(r, w, &message); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  var connect Connect
  guid, messageType, ts, err := ReadDataMessage(&message, &connect)
  if messageType != APP_MSGCONNECT || err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }
  if ts + APP_CONNECTEXPIRE < time.Now().Unix() {
    ErrResponse(w, http.StatusBadRequest, errors.New("message has expired"))
    return
  }

  // load referenced account
  var account store.Account
  if err := store.DB.Where("guid = ?", connect.Contact).First(&account).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }

  // see if card exists
  var card store.Card
  if err := store.DB.Where("account_id = ? AND guid = ?", account.ID, guid).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    // populate new record
    card.CardId = uuid.New().String()
    card.AccountID = account.ID
    card.Guid = guid
    card.Username = connect.Handle
    card.Name = connect.Name
    card.Description = connect.Description
    card.Location = connect.Location
    card.Image = connect.Image
    card.Version = connect.Version
    card.Node = connect.Node
    card.ProfileRevision = connect.ProfileRevision
    card.RemoteContent = connect.ContentRevision
    card.RemoteProfile = connect.ProfileRevision
    card.Status = APP_CARDPENDING
    card.DataRevision = 1
    card.OutToken = connect.Token

  } else {

    // update profile if revision changed
    if connect.ProfileRevision > card.ProfileRevision {
      card.Username = connect.Handle
      card.Name = connect.Name
      card.Description = connect.Description
      card.Location = connect.Location
      card.Image = connect.Image
      card.Version = connect.Version
      card.Node = connect.Node
      card.ProfileRevision = connect.ProfileRevision
    }
    if connect.ContentRevision > card.RemoteContent {
      card.RemoteContent = connect.ContentRevision
    }
    if connect.ProfileRevision > card.RemoteProfile {
      card.RemoteProfile = connect.ProfileRevision
    }
    if card.Status == APP_CARDCONFIRMED {
      card.Status = APP_CARDREQUESTED
    }
    if card.Status == APP_CARDCONNECTING {
      card.Status = APP_CARDCONNECTED
    }
    card.DataRevision += 1
    card.OutToken = connect.Token

  }

  // save contact card
  err  = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := store.DB.Save(&card).Error; res != nil {
      return res
    }
    if res := store.DB.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  status := &ContactStatus{
    Token: card.InToken,
    Status: card.Status,
  }
  SetStatus(&account)
  WriteResponse(w, &status)
}

