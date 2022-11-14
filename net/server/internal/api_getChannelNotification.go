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
    channel := store.Channel{}
    if store.DB.Model(&channel).Where("channel_id = ? AND account_id = ?", channelID, account.ID).First(&channel).Error != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }

    // retrun notification status
    WriteResponse(w, channel.HostPush)
  } else if tokenType == APPTokenContact {
    card, code, err := ParamContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    // get member entry
    member := store.Member{}
    if store.DB.Model(&member).Where("channel_id ? AND card_id = ?", channelID, card.ID).First(&member).Error != nil {
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
