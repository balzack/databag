package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "github.com/google/uuid"
  "databag/internal/store"
)

func AddChannelTopic(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  channelId := params["channelId"]

  var subject Subject
  if err := ParseRequest(r, w, &subject); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  var guid string
  var act *store.Account
  tokenType := r.Header.Get("TokenType")
  if tokenType == APP_TOKENAPP {
    account, code, err := BearerAppToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = account
    guid = account.Guid
  } else if tokenType == APP_TOKENCONTACT {
    card, code, err := BearerContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = &card.Account
    guid = card.Guid
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("unknown token type"))
    return
  }

  // load channel
  var channelSlot store.ChannelSlot
  if err := store.DB.Preload("Channel.Cards").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", act.ID, channelId).First(&channelSlot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if channelSlot.Channel == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty channel"))
    return
  }

  // check if a member
  if tokenType == APP_TOKENCONTACT {
    if !isMember(guid, channelSlot.Channel.Cards) {
      ErrResponse(w, http.StatusUnauthorized, errors.New("not a member of channel"))
      return
    }
  }

  topicSlot := &store.TopicSlot{}
  err := store.DB.Transaction(func(tx *gorm.DB) error {

    // add new record
    topic := &store.Topic{}
    topic.Data = subject.Data
    topic.DataType = subject.DataType
    topic.Channel = channelSlot.Channel
    topic.TagCount = 0
    topic.Guid = guid
    topic.DetailRevision = act.ChannelRevision + 1
    topic.TagRevision = act.ChannelRevision + 1
    topic.Status = APP_TOPICUNCONFIRMED
    if res := tx.Save(topic).Error; res != nil {
      return res
    }
    topicSlot.TopicSlotId = uuid.New().String()
    topicSlot.AccountID = act.ID
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
    if res := tx.Model(&act).Update("channel_revision", act.ChannelRevision + 1).Error; res != nil {
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
  WriteResponse(w, getTopicModel(topicSlot, true, true))
}

func isMember(guid string, cards []store.Card) bool {
  for _, card := range cards {
    if guid == card.Guid {
      return true
    }
  }
  return false
}

