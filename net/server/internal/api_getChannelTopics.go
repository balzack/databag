package databag

import (
  "strconv"
  "net/http"
  "databag/internal/store"
)

func reverseTopics(input []store.TopicSlot) []store.TopicSlot {
  var output []store.TopicSlot
  for i := len(input) - 1; i >= 0; i-- {
    output = append(output, input[i])
  }
  return output
}

func GetChannelTopics(w http.ResponseWriter, r *http.Request) {
  var revisionSet bool
  var revision int64
  var beginSet bool
  var begin int64
  var endSet bool
  var end int64
  var countSet bool
  var count int

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

  cnt := r.FormValue("count")
  if cnt != "" {
    countSet = true
    if count, err = strconv.Atoi(cnt); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  bn := r.FormValue("begin")
  if bn != "" {
    beginSet = true
    if begin, err = strconv.ParseInt(bn, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  en := r.FormValue("end")
  if en != "" {
    endSet = true
    if end, err = strconv.ParseInt(en, 10, 64); err != nil {
      ErrResponse(w, http.StatusBadRequest, err)
      return
    }
  }

  response := []*Topic{}
  if revisionSet {
    var slots []store.TopicSlot
    if beginSet && !endSet {
      if err := store.DB.Preload("Topic").Where("channel_id = ? AND revision > ? AND id >= ?", channelSlot.Channel.ID, revision, begin).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else if !beginSet && endSet {
      if err := store.DB.Preload("Topic").Where("channel_id = ? AND revision > ? AND id < ?", channelSlot.Channel.ID, revision, end).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else if beginSet && endSet {
      if err := store.DB.Preload("Topic").Where("channel_id = ? AND revision > ? AND id >= ? AND id < ?", channelSlot.Channel.ID, revision, begin, end).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Topic").Where("channel_id = ? AND revision > ?", channelSlot.Channel.ID, revision).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }
    for _, slot := range slots {
      response = append(response, getTopicRevisionModel(&slot))
    }
  } else {
    var slots []store.TopicSlot
    if countSet {
      if !endSet {
        if err := store.DB.Preload("Topic.Assets").Where("channel_id = ?", channelSlot.Channel.ID).Order("id desc").Limit(count).Find(&slots).Error; err != nil {
          ErrResponse(w, http.StatusInternalServerError, err)
          return
        }
      } else {
        if err := store.DB.Preload("Topic.Assets").Where("channel_id = ? AND id < ?", channelSlot.Channel.ID, end).Order("id desc").Limit(count).Find(&slots).Error; err != nil {
          ErrResponse(w, http.StatusInternalServerError, err)
          return
        }
      }
      slots = reverseTopics(slots)
    } else if beginSet && !endSet {
      if err := store.DB.Preload("Topic.Assets").Where("channel_id = ? AND id >= ?", channelSlot.Channel.ID, begin).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else if !beginSet && endSet {
      if err := store.DB.Preload("Topic.Assets").Where("channel_id = ? AND id < ?", channelSlot.Channel.ID, end).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else if beginSet && endSet {
      if err := store.DB.Preload("Topic.Assets").Where("channel_id = ? AND id >= ? AND id < ?", channelSlot.Channel.ID, begin, end).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      if err := store.DB.Preload("Topic.Assets").Where("channel_id = ?", channelSlot.Channel.ID).Find(&slots).Error; err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    }
    for _, slot := range slots {
      if slot.Topic != nil {
        if countSet {
          w.Header().Set("Topic-Marker", strconv.FormatUint(uint64(slot.ID), 10))
          countSet = false
        }
        response = append(response, getTopicModel(&slot))
      }
    }
  }

  w.Header().Set("Topic-Revision", strconv.FormatInt(channelSlot.Revision, 10))
  WriteResponse(w, response)
}

