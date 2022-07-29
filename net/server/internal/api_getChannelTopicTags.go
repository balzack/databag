package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func reverseTags(input []store.TagSlot) []store.TagSlot {
	var output []store.TagSlot
	for i := len(input) - 1; i >= 0; i-- {
		output = append(output, input[i])
	}
	return output
}

//GetChannelTopicTags retreives tags associated with topic
func GetChannelTopicTags(w http.ResponseWriter, r *http.Request) {
	var revisionSet bool
	var revision int64
	var beginSet bool
	var begin int64
	var endSet bool
	var end int64
	var countSet bool
	var count int

	// load channel slot
	channelSlot, _, code, err := getChannelSlot(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	topicID := params["topicID"]

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

	// load topic
	var topicSlot store.TopicSlot
	if err = store.DB.Preload("Topic").Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicID).First(&topicSlot).Error; err != nil {
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

	response := []*Tag{}
	if revisionSet {
		var slots []store.TagSlot
		if beginSet && !endSet {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND revision > ? AND id >= ?", topicSlot.Topic.ID, revision, begin).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		} else if !beginSet && endSet {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND revision > ? AND id < ?", topicSlot.Topic.ID, revision, end).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		} else if beginSet && endSet {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND revision > ? AND id >= ? AND id < ?", topicSlot.Topic.ID, revision, begin, end).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		} else {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND revision > ?", topicSlot.Topic.ID, revision).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		}
		for _, slot := range slots {
			response = append(response, getTagModel(&slot))
		}
	} else {
		var slots []store.TagSlot
		if countSet {
			if !endSet {
				if err := store.DB.Preload("Tag").Where("topic_id = ?", topicSlot.Topic.ID).Order("id desc").Limit(count).Find(&slots).Error; err != nil {
					ErrResponse(w, http.StatusInternalServerError, err)
					return
				}
			} else {
				if err := store.DB.Preload("Tag").Where("topic_id = ? AND id < ?", topicSlot.Topic.ID, end).Order("id desc").Limit(count).Find(&slots).Error; err != nil {
					ErrResponse(w, http.StatusInternalServerError, err)
					return
				}
			}
			slots = reverseTags(slots)
		} else if beginSet && !endSet {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND id >= ?", topicSlot.Topic.ID, begin).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		} else if !beginSet && endSet {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND id < ?", topicSlot.Topic.ID, end).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		} else if beginSet && endSet {
			if err := store.DB.Preload("Tag").Where("topic_id = ? AND id >= ? AND id < ?", topicSlot.Topic.ID, begin, end).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		} else {
			if err := store.DB.Preload("Tag").Where("topic_id = ?", topicSlot.Topic.ID).Find(&slots).Error; err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
		}
		for _, slot := range slots {
			if slot.Tag != nil {
				if countSet {
					w.Header().Set("Tag-Marker", strconv.FormatUint(uint64(slot.ID), 10))
					countSet = false
				}
				response = append(response, getTagModel(&slot))
			}
		}
	}

	w.Header().Set("Tag-Revision", strconv.FormatInt(topicSlot.Revision, 10))
	WriteResponse(w, response)
}
