package databag

import (
  "strings"
  "time"
  "bytes"
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
  "encoding/base64"
  "github.com/valyala/fastjson"
)

func GetChannelTopicTagSubjectField(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]
  tagId := params["tagId"]
  field := params["field"]
  elements := strings.Split(field, ".")

  channelSlot, _, err, code := getChannelSlot(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // load tag
  var tagSlot store.TagSlot
  if err = store.DB.Preload("Tag.Topic.TopicSlot").Where("channel_id = ? AND tag_slot_id = ?", channelSlot.Channel.ID, tagId).First(&tagSlot).Error; err != nil {
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
  if tagSlot.Tag.Topic.TopicSlot.TopicSlotId != topicId {
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
