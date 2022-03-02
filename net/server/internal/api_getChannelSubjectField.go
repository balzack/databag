package databag

import (
  "time"
  "bytes"
  "errors"
  "strings"
  "net/http"
  "gorm.io/gorm"
  "encoding/base64"
  "github.com/gorilla/mux"
  "databag/internal/store"
  "github.com/valyala/fastjson"
)

func GetChannelSubjectField(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  channelId := params["channelId"]
  field := params["field"]
  elements := strings.Split(field, ".")

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
  var slot store.ChannelSlot
  if err := store.DB.Preload("Channel.Groups.Cards").Preload("Channel.Cards").Where("account_id = ? AND channel_slot_id = ?", act.ID, channelId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Channel == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced channel missing"))
    return
  }

  // check if channel is shared
  if tokenType == APP_TOKENCONTACT && !isChannelShared(guid, slot.Channel) {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced channel not shared"))
    return
  }

  // decode data
  strData := fastjson.GetString([]byte(slot.Channel.Data), elements...)
  binData, err := base64.StdEncoding.DecodeString(strData)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, err)
    return
  }

  // response with content
  http.ServeContent(w, r, field, time.Unix(slot.Channel.Updated, 0), bytes.NewReader(binData))
}

