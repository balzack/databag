package databag

import (
  "os"
  "io"
  "errors"
  "github.com/google/uuid"
  "net/http"
	"hash/crc32"
  "github.com/gorilla/mux"
  "gorm.io/gorm"
  "databag/internal/store"
  "encoding/json"
)

func AddChannelTopicAsset(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  topicId := params["topicId"]
  var transforms []string
  if r.FormValue("transforms") != "" {
    if err := json.Unmarshal([]byte(r.FormValue("transforms")), &transforms); err != nil {
      ErrResponse(w, http.StatusBadRequest, errors.New("invalid asset transform"))
      return
    }
  }

PrintMsg(transforms)

  channelSlot, guid, err, code := getChannelSlot(r, true)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  act := &channelSlot.Account

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

  // can only update topic if creator
  if topicSlot.Topic.Guid != guid {
    ErrResponse(w, http.StatusUnauthorized, errors.New("topic not created by you"))
    return
  }

  // save new file
  id := uuid.New().String()
  path := getStrConfigValue(CONFIG_ASSETPATH, ".") + "/" + channelSlot.Account.Guid + "/" + id
  if err := r.ParseMultipartForm(32 << 20); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }
  file, _, err := r.FormFile("asset")
	if err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}
  defer file.Close()
  crc, size, err := SaveAsset(file, path)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  assets := []Asset{}
  asset := &store.Asset{}
  asset.AssetId = id
  asset.AccountID = channelSlot.Account.ID
  asset.TopicID = topicSlot.Topic.ID
  asset.Status = APP_ASSETREADY
  asset.Size = size
  asset.Crc = crc
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Save(asset).Error; res != nil {
      return res
    }
    assets = append(assets, Asset{ AssetId: id, Status: APP_ASSETREADY})
    for _, transform := range transforms {
      asset := &store.Asset{}
      asset.AssetId = uuid.New().String()
      asset.AccountID = channelSlot.Account.ID
      asset.TopicID = topicSlot.Topic.ID
      asset.Status = APP_ASSETWAITING
      asset.Transform = transform
      asset.TransformId = id
      if res := tx.Save(asset).Error; res != nil {
        return res
      }
      assets = append(assets, Asset{ AssetId: asset.AssetId, Transform: transform, Status: APP_ASSETWAITING})
    }
    if res := tx.Model(&topicSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&channelSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(act).Update("channel_revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // determine affected contact list
  cards := make(map[string]store.Card)
  for _, card := range channelSlot.Channel.Cards {
    cards[card.Guid] = card
  }
  for _, group := range channelSlot.Channel.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = card
    }
  }

  SetStatus(act)
  for _, card := range cards {
    SetContactChannelNotification(act, &card)
  }
  WriteResponse(w, &assets)
}

func SaveAsset(src io.Reader, path string) (crc uint32, size int64, err error) {

  output, res := os.OpenFile(path, os.O_WRONLY | os.O_CREATE, 0666)
  if res != nil {
    err = res
    return
  }
  defer output.Close()

  // prepare hash
  table := crc32.MakeTable(crc32.IEEE)

  // compute has as data is saved
  data := make([]byte, 4096)
  for {
    n, res := src.Read(data)
    if res != nil {
      if res == io.EOF {
        break
      }
      err = res
      return
    }

    crc = crc32.Update(crc, table, data[:n])
    output.Write(data[:n])
  }

  // read size
  info, ret := output.Stat()
  if ret != nil {
    err = ret
    return
  }
  size = info.Size()
  return
}

