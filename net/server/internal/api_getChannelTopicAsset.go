package databag

import (
  "errors"
  "gorm.io/gorm"
  "net/http"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetChannelTopicAsset(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]
  assetId := params["assetId"]

  channelSlot, _, err, code := getChannelSlot(r, true)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  act := &channelSlot.Account

  // load asset
  var asset store.Asset
  if err = store.DB.Preload("Topic.TopicSlot").Where("channel_id = ? AND asset_id = ?", channelSlot.Channel.ID, assetId).First(&asset).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if asset.Topic.TopicSlot.TopicSlotId != topicId {
    ErrResponse(w, http.StatusNotFound, errors.New("invalid topic asset"))
    return
  }
  if asset.Transform == "" {
    ErrResponse(w, http.StatusUnauthorized, errors.New("transform source files not accessible"))
    return
  }

  // construct file path
  path := getStrConfigValue(CONFIG_ASSETPATH, ".") + "/" + act.Guid + "/" + asset.AssetId
  http.ServeFile(w, r, path)
}

