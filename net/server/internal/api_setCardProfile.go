package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetCardProfile(w http.ResponseWriter, r *http.Request) {
  var msg DataMessage

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  cardId := params["cardId"]

  if err := ParseRequest(r, w, &msg); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  // load referenced card
  var slot store.CardSlot
  if err := store.DB.Preload("Card.Groups").Where("account_id = ? AND card_slot_id = ?", account.ID, cardId).First(&slot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if slot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced slot is empty"))
    return
  }

  var identity Identity
  guid, messageType, _, err := ReadDataMessage(&msg, &identity)
  if messageType != APP_MSGIDENTITY || err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }
  if slot.Card.Guid != guid {
    ErrResponse(w, http.StatusBadRequest, errors.New("slot does not contain specified contact"))
    return
  }

  if slot.Card.ProfileRevision >= identity.Revision {
    WriteResponse(w, getCardModel(&slot))
    return
  }

  // update card
  slot.Card.ProfileRevision = identity.Revision
  slot.Card.Username = identity.Handle
  slot.Card.Name = identity.Name
  slot.Card.Description = identity.Description
  slot.Card.Location = identity.Location
  slot.Card.Image = identity.Image
  slot.Card.Version = identity.Version
  slot.Card.Node = identity.Node
  slot.Revision = account.CardRevision + 1

  // save and update contact revision
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Save(&slot.Card).Error; res != nil {
      return res
    }
    if res := tx.Preload("Card").Save(&slot).Error; res != nil {
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

  SetStatus(account)
  WriteResponse(w, getCardProfileModel(&slot));
}

