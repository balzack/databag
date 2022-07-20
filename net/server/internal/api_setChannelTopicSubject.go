package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetChannelTopicSubject(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]
  confirm := r.FormValue("confirm");

  var subject Subject
  if err := ParseRequest(r, w, &subject); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  channelSlot, guid, err, code := getChannelSlot(r, true)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  act := &channelSlot.Account

  // load topic
  var topicSlot store.TopicSlot
  if err = store.DB.Preload("Topic").Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicId).First(&topicSlot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }

  // can only update subject if creator
  if topicSlot.Topic.Guid != guid {
    ErrResponse(w, http.StatusUnauthorized, errors.New("topic not created by you"))
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {

    if res := tx.Model(topicSlot.Topic).Update("data", subject.Data).Error; res != nil {
      return res
    }
    if res := tx.Model(topicSlot.Topic).Update("data_type", subject.DataType).Error; res != nil {
      return res
    }
    if confirm == "true" {
      if res := tx.Model(topicSlot.Topic).Update("status", APP_TOPICCONFIRMED).Error; res != nil {
        return res
      }
    }
    if confirm == "false" {
      if res := tx.Model(topicSlot.Topic).Update("status", APP_TOPICUNCONFIRMED).Error; res != nil {
        return res
      }
    }
    if res := tx.Model(&topicSlot.Topic).Update("detail_revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&topicSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&channelSlot.Channel).Update("topic_revision", act.ChannelRevision + 1).Error; res != nil {
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
  WriteResponse(w, getTopicModel(&topicSlot))
}


