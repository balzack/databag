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

//GetChannelTopicSubjectField base64 decodes and downloads a channel topic subject attribute
func GetChannelTopicSubjectField(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	topicID := params["topicID"]
	field := params["field"]
	elements := strings.Split(field, ".")

	channelSlot, _, code, err := getChannelSlot(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// load topic
	var topicSlot store.TopicSlot
	if err = store.DB.Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicID).First(&topicSlot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			code = http.StatusNotFound
		} else {
			code = http.StatusInternalServerError
		}
		ErrResponse(w, code, err)
		return
	}
	if topicSlot.Topic == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced missing topic"))
		return
	}

	// decode data
	strData := fastjson.GetString([]byte(topicSlot.Topic.Data), elements...)
	binData, err := base64.StdEncoding.DecodeString(strData)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, err)
		return
	}

	// response with content
	http.ServeContent(w, r, field, time.Unix(topicSlot.Topic.Updated, 0), bytes.NewReader(binData))
}
