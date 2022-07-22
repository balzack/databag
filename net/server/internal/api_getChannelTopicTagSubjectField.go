package databag

import (
	"bytes"
	"databag/internal/store"
	"encoding/base64"
	"errors"
	"github.com/gorilla/mux"
	"github.com/valyala/fastjson"
	"gorm.io/gorm"
	"net/http"
	"strings"
	"time"
)

func GetChannelTopicTagSubjectField(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	topicID := params["topicID"]
	tagID := params["tagID"]
	field := params["field"]
	elements := strings.Split(field, ".")

	channelSlot, _, err, code := getChannelSlot(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// load tag
	var tagSlot store.TagSlot
	if err = store.DB.Preload("Tag.Topic.TopicSlot").Where("channel_id = ? AND tag_slot_id = ?", channelSlot.Channel.ID, tagID).First(&tagSlot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			code = http.StatusNotFound
		} else {
			code = http.StatusInternalServerError
		}
		return
	}
	if tagSlot.Tag == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced missing tag"))
		return
	}
	if tagSlot.Tag.Topic.TopicSlot.TopicSlotID != topicID {
		ErrResponse(w, http.StatusNotFound, errors.New("invalid topic tag"))
		return
	}

	// decode data
	strData := fastjson.GetString([]byte(tagSlot.Tag.Data), elements...)
	binData, err := base64.StdEncoding.DecodeString(strData)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, err)
		return
	}

	// response with content
	http.ServeContent(w, r, field, time.Unix(tagSlot.Tag.Updated, 0), bytes.NewReader(binData))
}
