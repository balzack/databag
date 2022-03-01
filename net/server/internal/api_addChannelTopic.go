package databag

import (
  "net/http"
  "gorm.io/gorm"
  "github.com/google/uuid"
  "databag/internal/store"
)

func AddChannelTopic(w http.ResponseWriter, r *http.Request) {

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

  topicSlot := &store.TopicSlot{}
  err = store.DB.Transaction(func(tx *gorm.DB) error {

    // add new record
    topic := &store.Topic{}
    topic.Data = subject.Data
    topic.DataType = subject.DataType
    topic.TagCount = 0
    topic.Guid = guid
    topic.DetailRevision = act.ChannelRevision + 1
    topic.TagRevision = act.ChannelRevision + 1
    topic.Status = APP_TOPICUNCONFIRMED
    topic.Transform = APP_TRANSFORMCOMPLETE
    if res := tx.Save(topic).Error; res != nil {
      return res
    }
    topicSlot.TopicSlotId = uuid.New().String()
    topicSlot.AccountID = act.ID
    topicSlot.ChannelID = channelSlot.Channel.ID
    topicSlot.TopicID = topic.ID
    topicSlot.Revision = act.ChannelRevision + 1
    topicSlot.Topic = topic
    if res := tx.Save(topicSlot).Error; res != nil {
      return res
    }

    // update parent revision
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
  WriteResponse(w, getTopicModel(topicSlot))
}


