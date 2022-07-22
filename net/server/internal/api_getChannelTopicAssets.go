package databag

import (
  "errors"
  "net/http"
  "github.com/gorilla/mux"
  "gorm.io/gorm"
  "databag/internal/store"
)

func GetChannelTopicAssets(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicID := params["topicID"]

  channelSlot, guid, err, code := getChannelSlot(r, true)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // load topic
  var topicSlot store.TopicSlot
  if err = store.DB.Preload("Topic.Assets").Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicID).First(&topicSlot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if topicSlot.Topic == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty topic"))
    return
  }

  // only creator can list assets
  if topicSlot.Topic.GUID != guid {
    ErrResponse(w, http.StatusUnauthorized, errors.New("permission denied to asset list"))
    return
  }

  // return list of assets
  assets := []Asset{}
  for _, asset := range topicSlot.Topic.Assets {
    assets = append(assets, Asset{ AssetID: asset.AssetID, Status: asset.Status })
  }
  WriteResponse(w, &assets)
}
