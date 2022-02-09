package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "encoding/hex"
  "github.com/google/uuid"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
)

func AddCard(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var message DataMessage
  if err := ParseRequest(r, w, &message); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  var identity Identity
  guid, messageType, _, err := ReadDataMessage(&message, &identity)
  if messageType != APP_MSGIDENTITY || err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  slot := &store.CardSlot{}
  var card store.Card
  if err := store.DB.Preload("CardSlot").Preload("Groups").Where("account_id = ? AND guid = ?", account.Guid, guid).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    // create new card data
    data, res := securerandom.Bytes(APP_TOKENSIZE)
    if res != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
    card := &store.Card{
      Guid: guid,
      Username: identity.Handle,
      Name: identity.Name,
      Description: identity.Description,
      Location: identity.Location,
      Image: identity.Image,
      Version: identity.Version,
      Node: identity.Node,
      ProfileRevision: identity.Revision,
      Status: APP_CARDCONFIRMED,
      ViewRevision: 0,
      InToken: hex.EncodeToString(data),
      AccountID: account.Guid,
    }

    // create new card or update existing
    if err = store.DB.Where("account_id = ? AND card_id = 0", account.ID).First(slot).Error; err != nil {
      if !errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
      err = store.DB.Transaction(func(tx *gorm.DB) error {
        if res := tx.Save(card).Error; res != nil {
          return res
        }
        slot.CardSlotId = uuid.New().String()
        slot.AccountID = account.ID
        slot.Revision = account.CardRevision + 1
        slot.CardID = card.ID
        slot.Card = card
        if res := tx.Save(slot).Error; res != nil {
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
    } else {
      err = store.DB.Transaction(func(tx *gorm.DB) error {
        if res := tx.Save(&card).Error; res != nil {
          return res
        }
        slot.Revision = account.CardRevision + 1
        slot.CardID = card.ID
        slot.Card = card
        if res := tx.Save(&slot).Error; res != nil {
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
    }
  } else {

    if identity.Revision > card.ProfileRevision {

      // update card data
      card.Username = identity.Handle
      card.Name = identity.Name
      card.Description = identity.Description
      card.Location = identity.Location
      card.Image = identity.Image
      card.Version = identity.Version
      card.Node = identity.Node
      card.ProfileRevision = identity.Revision
    }

    // save contact card
    err  = store.DB.Transaction(func(tx *gorm.DB) error {
      if res := tx.Save(&card).Error; res != nil {
        return res
      }
      slot = &card.CardSlot
      if slot == nil {
        slot = &store.CardSlot{
          CardSlotId: uuid.New().String(),
          AccountID: account.ID,
          Revision: account.CardRevision + 1,
          CardID: card.ID,
          Card: &card,
        }
      } else {
        slot.Revision = account.CardRevision + 1
      }
      if res := tx.Preload("Card").Save(slot).Error; res != nil {
        return res
      }
      if res := tx.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
        return res
      }
      slot.Card = &card
      return nil
    })
  }

  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  WriteResponse(w, getCardModel(slot))
}

