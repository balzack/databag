package databag

import (
  "errors"
  "strconv"
  "net/http"
  "github.com/gorilla/mux"
  "gorm.io/gorm"
  "databag/internal/store"
)

func GetChannelTopicTags(w http.ResponseWriter, r *http.Request) {
  var revisionSet bool
  var revision int64

  // load channel slot
  channelSlot, _, err, code := getChannelSlot(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]
  rev := r.FormValue("revision")
  if rev != "" {
    revisionSet = true
    if revision, err = strconv.ParseInt(rev, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  // load topic
  var topicSlot store.TopicSlot
  if err = store.DB.Preload("Topic").Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicId).First(&topicSlot).Error; err != nil {
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

  var response []*Tag
  if revisionSet {
    var slots []store.TagSlot
    if err := store.DB.Preload("Tag").Where("topic_id = ? AND revision > ?", topicSlot.Topic.ID, revision).Find(&slots).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
    for _, slot := range slots {
      response = append(response, getTagModel(&slot))
    }
  } else {
    var slots []store.TagSlot
    if err := store.DB.Preload("Tag").Where("topic_id = ?", topicSlot.Topic.ID).Find(&slots).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
    for _, slot := range slots {
      if slot.Tag != nil {
        response = append(response, getTagModel(&slot))
      }
    }
  }

  w.Header().Set("Tag-Revision", strconv.FormatInt(topicSlot.Revision, 10))
  WriteResponse(w, response)
}

