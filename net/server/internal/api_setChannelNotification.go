package databag

import (
  "databag/internal/store"
  "errors"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "net/http"
)

//SetChannelNotifications enables or disables notifcation
func SetChannelNotification(w http.ResponseWriter, r *http.Request) {

  // get referenced channel
  params := mux.Vars(r)
  channelID := params["channelID"]

  // get enabled state
  var flag bool
  if err := ParseRequest(r, w, &flag); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

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

    // update host notification status
    if err = store.DB.Model(&store.Channel{}).Where("account_id = ? AND id = ?", account.ID, slot.Channel.ID).Update("host_push", flag).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
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

    // update member notification status
    if err := store.DB.Model(&store.Member{}).Where("channel_id = ? AND card_id = ?", slot.Channel.ID, card.ID).Update("push_enabled", flag).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
  } else {
    ErrResponse(w, http.StatusUnauthorized, errors.New("invalid access token"))
    return
  }
}
