package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func RemoveChannel(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  channelId := params["channelId"]

  // validate contact access
  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // load channel
  var slot store.ChannelSlot
  if err = store.DB.Preload("Channel.Cards").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", account.ID, channelId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Channel == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty channel"))
    return
  }

  // determine affected contact list
  cards := make(map[string]store.Card)
  for _, card := range slot.Channel.Cards {
    cards[card.Guid] = card
  }
  for _, group := range slot.Channel.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = card
    }
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Model(&slot.Channel).Association("Groups").Clear(); res != nil {
      return res
    }
    slot.Channel.Groups = []store.Group{}
    if res := tx.Model(&slot.Channel).Association("Cards").Clear(); res != nil {
      return res
    }
    slot.Channel.Cards = []store.Card{}
    if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Tag{}).Error; res != nil {
      return res
    }
    if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.TagSlot{}).Error; res != nil {
      return res
    }
    if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Asset{}).Error; res != nil {
      return res
    }
    if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Topic{}).Error; res != nil {
      return res
    }
    if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.TopicSlot{}).Error; res != nil {
      return res
    }
    slot.Channel.Topics = []store.Topic{}
    if res := tx.Delete(&slot.Channel).Error; res != nil {
      return res
    }
    slot.Channel = nil
    if res := tx.Model(&slot).Update("revision", account.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(account).Update("channel_revision", account.ChannelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // cleanup file assets
  go garbageCollect(account)

  SetStatus(account)
  for _, card := range cards {
    SetContactChannelNotification(account, &card)
  }
  WriteResponse(w, nil)
}


