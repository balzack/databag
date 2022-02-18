package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetChannelTopicCount(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]

  var subject Subject
  if err := ParseRequest(r, w, &subject); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

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

  WriteResponse(w, getTopicCountModel(&topicSlot))
}

