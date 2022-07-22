package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetChannelSummary(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  channelID := params["channelID"]

  var guid string
  var act *store.Account
  tokenType := ParamTokenType(r)
  if tokenType == APPTokenAgent {
    account, code, err := ParamAgentToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = account
  } else if tokenType == APPTokenContact {
    card, code, err := ParamContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = &card.Account
    guid = card.GUID
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("unknown token type"))
    return
  }

  // load channel
  var slot store.ChannelSlot
  if err := store.DB.Preload("Channel.Topics", func(db *gorm.DB) *gorm.DB {
    return store.DB.Order("topics.id DESC").Limit(1)
  }).Preload("Channel.Cards.CardSlot").Preload("Channel.Groups.Cards").Preload("Channel.Groups.GroupSlot").Where("account_id = ? AND channel_slot_id = ?", act.ID, channelID).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }

  // return model data
  if guid != "" {
    if isChannelShared(guid, slot.Channel) {
      WriteResponse(w, getChannelSummaryModel(&slot))
    } else {
      ErrResponse(w, http.StatusNotFound, errors.New("channel not shared with requestor"));
      return
    }
  } else {
    WriteResponse(w, getChannelSummaryModel(&slot))
  }
}

