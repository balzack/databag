package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func RemoveChannelTopic(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  channelId := params["channelId"]
  topicId := params["topicId"]

  channelSlot, guid, err, code := getChannelSlot(r, true)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  act := &channelSlot.Account

  // load topic
  var topicSlot store.TopicSlot
  if ret := store.DB.Preload("Topic.Channel.ChannelSlot").Where("account_id = ? AND topic_slot_id = ?", act.ID, topicId).First(&topicSlot).Error; ret != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, ret)
    } else {
      ErrResponse(w, http.StatusInternalServerError, ret)
    }
  }
  if topicSlot.Topic == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty topic"))
    return
  }
  if topicSlot.Topic.Channel.ChannelSlot.ChannelSlotId != channelId {
    ErrResponse(w, http.StatusNotFound, errors.New("channel topic not found"))
    return
  }

  // check permission
  if topicSlot.Topic.Guid != guid {
    ErrResponse(w, http.StatusUnauthorized, errors.New("not creator of topic"))
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {

    if res := tx.Where("topic_id = ?", topicSlot.Topic.ID).Delete(&store.Tag{}).Error; res != nil {
      return res
    }
    if res := tx.Where("topic_id = ?", topicSlot.Topic.ID).Delete(&store.TagSlot{}).Error; res != nil {
      return res
    }
    if res := tx.Where("topic_id = ?", topicSlot.Topic.ID).Delete(&store.Asset{}).Error; res != nil {
      return res
    }
    if res := tx.Delete(&topicSlot.Topic).Error; res != nil {
      return res
    }
    topicSlot.Topic = nil
    if res := tx.Model(&topicSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&channelSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(act).Update("channel_revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // cleanup file assets
  go garbageCollect(act)

  // determine affected contact list
  cards := make(map[string]store.Card)
  for _, card := range channelSlot.Channel.Cards {
    cards[card.Guid] = card
  }
  for _, group := range channelSlot.Channel.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = card
    }
  }

  SetStatus(act)
  for _, card := range cards {
    SetContactChannelNotification(act, &card)
  }
  WriteResponse(w, nil)
}


