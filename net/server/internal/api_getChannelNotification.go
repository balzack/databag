package databag

import (
  "databag/internal/store"
  "errors"
  "github.com/gorilla/mux"
  "gorm.io/gorm"
  "net/http"
)

//GetChannelNotifications gets enabled state of channel
func GetChannelNotification(w http.ResponseWriter, r *http.Request) {

  // get referenced channel
  params := mux.Vars(r)
  channelID := params["channelID"]

  tokenType := ParamTokenType(r)
  if tokenType == APPTokenAgent {
    account, code, err := ParamAgentToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    // get channel entry
    slot := store.ChannelSlot{}
    if err := store.DB.Model(&slot).Preload("Channel").Where("channel_slot_id = ? AND account_id = ?", channelID, account.ID).First(&slot).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }
    if (slot.Channel == nil) {
      ErrResponse(w, http.StatusNotFound, errors.New("referenced empty channel"));
      return;
    }

    // return notification status
    WriteResponse(w, slot.Channel.HostPush)
  } else if tokenType == APPTokenContact {
    card, code, err := ParamContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    // get channel entry
    slot := store.ChannelSlot{}
    if err := store.DB.Model(&slot).Preload("Channel").Where("channel_slot_id = ? AND account_id = ?", channelID, card.Account.ID).First(&slot).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }
    if (slot.Channel == nil) {
      ErrResponse(w, http.StatusNotFound, errors.New("referenced empty channel"));
      return;
    }

    // get member entry
    member := store.Member{}
    if err := store.DB.Model(&member).Where("channel_id = ? AND card_id = ?", slot.Channel.ID, card.ID).First(&member).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }

    // return notification status
    WriteResponse(w, member.PushEnabled)
  } else {
    ErrResponse(w, http.StatusUnauthorized, errors.New("invalid access token"))
  }
}
