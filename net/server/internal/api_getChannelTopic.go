package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetChannelTopic(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]

  channelSlot, _, err, code := getChannelSlot(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // load topic
  var topicSlot store.TopicSlot
  if err = store.DB.Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicId).First(&topicSlot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      code = http.StatusNotFound
    } else {
      code = http.StatusInternalServerError
    }
    return
  }

  WriteResponse(w, getTopicModel(&topicSlot))
}

func isMember(guid string, cards []store.Card) bool {
  for _, card := range cards {
    if guid == card.Guid {
      return true
    }
  }
  return false
}

func isViewer(guid string, groups []store.Group) bool {
  for _, group := range groups {
    for _, card := range group.Cards {
      if guid == card.Guid {
        return true
      }
    }
  }
  return false
}

func getChannelSlot(r *http.Request, member bool) (slot store.ChannelSlot, guid string, err error, code int) {

  // scan parameters
  params := mux.Vars(r)
  channelId := params["channelId"]

  // validate contact access
  var account *store.Account
  tokenType := r.Header.Get("TokenType")
  if tokenType == APP_TOKENAPP {
    account, code, err = BearerAppToken(r, false);
    if err != nil {
      return
    }
    guid = account.Guid
  } else if tokenType == APP_TOKENCONTACT {
    var card *store.Card
    card, code, err = BearerContactToken(r, true)
    if err != nil {
      return
    }
    account = &card.Account
    guid = card.Guid
  } else {
    err = errors.New("unknown token type")
    code = http.StatusBadRequest
    return
  }

  // load channel
  if err = store.DB.Preload("Account").Preload("Channel.Cards").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", account.ID, channelId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      code = http.StatusNotFound
    } else {
      code = http.StatusInternalServerError
    }
    return
  }
  if slot.Channel == nil {
    err = errors.New("referenced empty channel")
    code = http.StatusNotFound
    return
  }

  // validate access to channel
  if tokenType == APP_TOKENCONTACT {
    if member && !isMember(guid, slot.Channel.Cards) {
      err = errors.New("contact is not a channel member")
      code = http.StatusUnauthorized
      return
    } else if !isViewer(guid, slot.Channel.Groups) && !isMember(guid, slot.Channel.Cards) {
      err = errors.New("contact is not a channel viewer")
      code = http.StatusUnauthorized
      return
    }
  }

  return
}

