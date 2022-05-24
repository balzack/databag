package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func ClearChannelCard(w http.ResponseWriter, r *http.Request) {

  account, code, err := ParamAgentToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  channelId := params["channelId"]
  cardId := params["cardId"]

  // load referenced channel
  var channelSlot store.ChannelSlot
  if err := store.DB.Preload("Channel.Cards.CardSlot").Preload("Channel.Groups.GroupSlot").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", account.ID, channelId).First(&channelSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if channelSlot.Channel == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("channel has been deleted"))
    return
  }

  // load referenced card 
  var cardSlot store.CardSlot
  if err := store.DB.Preload("Card.CardSlot").Where("account_id = ? AND card_slot_id = ?", account.ID, cardId).First(&cardSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if cardSlot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
    return
  }

  // determine contact list
  cards := make(map[string]store.Card)
  for _, card := range channelSlot.Channel.Cards {
    cards[card.Guid] = card
  }
  for _, group := range channelSlot.Channel.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = card
    }
  }

  // save and update contact revision
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Model(&channelSlot.Channel).Association("Cards").Delete(cardSlot.Card); res != nil {
      return res
    }
    if res := tx.Model(&channelSlot.Channel).Update("detail_revision", account.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&channelSlot).Update("revision", account.ChannelRevision + 1).Error; res != nil {
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

  // notify contacts of content change
  SetStatus(account)
  for _, card := range cards {
    SetContactChannelNotification(account, &card)
  }
  WriteResponse(w, getChannelModel(&channelSlot, true, true));
}

