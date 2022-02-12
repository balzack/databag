package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func RemoveCard(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  cardId := params["cardId"]

  // load referenced card
  var slot store.CardSlot
  if err := store.DB.Preload("Card.Groups").Preload("Card.Channels.Cards").Preload("Card.Channels.ChannelSlot").Where("account_id = ? AND card_slot_id = ?", account.ID, cardId).First(&slot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if slot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
    return
  }

  // cards to update
  cards := make(map[string]*store.Card)

  // save and update contact revision
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    for _, channel := range slot.Card.Channels {
      if res := tx.Model(&channel).Association("Cards").Delete(&slot.Card); res != nil {
        return res
      }
      if res := tx.Model(&channel.ChannelSlot).Update("revision", account.ChannelRevision + 1).Error; res != nil {
        return res
      }
      for _, card := range channel.Cards {
        cards[card.Guid] = &card
      }
    }
    if res := tx.Model(&slot.Card).Association("Groups").Clear(); res != nil {
      return res
    }
    if res := tx.Delete(&slot.Card).Error; res != nil {
      return res
    }
    slot.Card = nil
    if res := tx.Model(&slot).Update("card_id", 0).Error; res != nil {
      return res
    }
    if res := tx.Model(&slot).Update("revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("channel_revision", account.ChannelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  for _, card := range cards {
    SetContactChannelNotification(account, card)
  }
  SetStatus(account)
  WriteResponse(w, nil);
}

