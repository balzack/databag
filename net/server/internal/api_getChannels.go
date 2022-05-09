package databag

import (
  "strings"
  "errors"
  "strconv"
  "net/http"
  "gorm.io/gorm"
  "encoding/json"
  "databag/internal/store"
)

func GetChannels(w http.ResponseWriter, r *http.Request) {
  var channelRevisionSet bool
  var channelRevision int64
  var viewRevisionSet bool
  var viewRevision int64
  var typesSet bool
  var types []string

  channel := r.FormValue("channelRevision")
  if channel != "" {
    var err error
    channelRevisionSet = true
    if channelRevision, err = strconv.ParseInt(channel, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  view := r.FormValue("viewRevision")
  if view != "" {
    var err error
    viewRevisionSet = true
    if viewRevision, err = strconv.ParseInt(view, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  schemas := r.FormValue("types")
  if schemas != "" {
    var err error
    typesSet = true
    dec := json.NewDecoder(strings.NewReader(schemas))
    if dec.Decode(&types) != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  response := []*Channel{}
  tokenType := ParamTokenType(r)
  if tokenType == APP_TOKENAGENT {

    account, code, err := ParamAgentToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    var slots []store.ChannelSlot
    if channelRevisionSet {
      if err := store.DB.Preload("Channel").Where("account_id = ? AND revision > ?", account.ID, channelRevision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Channel.Topics", func(db *gorm.DB) *gorm.DB {
        return store.DB.Order("topics.id DESC").Limit(1)
      }).Preload("Channel.Cards.CardSlot").Preload("Channel.Groups.GroupSlot").Where("account_id = ? AND channel_id != 0", account.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }

    for _, slot := range slots {
      if !typesSet || hasChannelType(types, slot.Channel) {
        if channelRevisionSet {
          response = append(response, getChannelRevisionModel(&slot, true))
        } else if slot.Channel != nil {
          response = append(response, getChannelModel(&slot, true, true))
        }
      }
    }

    w.Header().Set("Channel-Revision", strconv.FormatInt(account.ChannelRevision, 10))

  } else if tokenType == APP_TOKENCONTACT {

    card, code, err := ParamContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    if viewRevisionSet || channelRevisionSet {
      if viewRevision != card.ViewRevision {
        ErrResponse(w, http.StatusGone, errors.New("channel view has changed"))
        return
      }
    }

    account := &card.Account
    var slots []store.ChannelSlot
    if channelRevisionSet {
      if err := store.DB.Preload("Channel.Cards").Preload("Channel.Groups.Cards").Where("account_id = ? AND revision > ?", account.ID, channelRevision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Channel.Topics", func(db *gorm.DB) *gorm.DB {
        return store.DB.Order("topics.id DESC").Limit(1)
      }).Preload("Channel.Cards").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_id != 0", account.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }

    for _, slot := range slots {
      if !typesSet || hasChannelType(types, slot.Channel) {
        shared := isChannelShared(card.Guid, slot.Channel)
        if channelRevisionSet {
          response = append(response, getChannelRevisionModel(&slot, shared))
        } else if shared {
          response = append(response, getChannelModel(&slot, true, false))
        }
      }
    }

    w.Header().Set("Channel-Revision", strconv.FormatInt(account.ChannelRevision, 10))
    w.Header().Set("View-Revision", strconv.FormatInt(card.ViewRevision, 10))

  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
    return
  }

  WriteResponse(w, response)
}

func isChannelShared(guid string, channel *store.Channel) bool {
  if channel == nil {
    return false
  }
  for _, card := range channel.Cards {
    if guid == card.Guid {
      return true
    }
  }
  for _, group := range channel.Groups {
    for _, card := range group.Cards {
      if guid == card.Guid {
        return true
      }
    }
  }
  return false
}

func hasChannelType(types []string, channel *store.Channel) bool {
  if channel == nil {
    return false
  }
  for _, schema := range types {
    if schema == channel.DataType {
      return true
    }
  }
  return false
}

