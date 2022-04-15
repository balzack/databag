package databag

import (
  "strconv"
  "net/http"
  "databag/internal/store"
)

func GetChannelTopics(w http.ResponseWriter, r *http.Request) {
  var revisionSet bool
  var revision int64

  channelSlot, _, err, code := getChannelSlot(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  rev := r.FormValue("revision")
  if rev != "" {
    revisionSet = true
    if revision, err = strconv.ParseInt(rev, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  response := []*Topic{}
  if revisionSet {
    var slots []store.TopicSlot
    if err := store.DB.Preload("Topic").Where("channel_id = ? AND revision > ?", channelSlot.Channel.ID, revision).Find(&slots).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
    for _, slot := range slots {
      response = append(response, getTopicRevisionModel(&slot))
    }
  } else {
    var slots []store.TopicSlot
    if err := store.DB.Preload("Topic.Assets").Where("channel_id = ?", channelSlot.Channel.ID).Find(&slots).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
    for _, slot := range slots {
      if slot.Topic != nil {
        response = append(response, getTopicModel(&slot))
      }
    }
  }

  w.Header().Set("Topic-Revision", strconv.FormatInt(channelSlot.Revision, 10))
  WriteResponse(w, response)
}

