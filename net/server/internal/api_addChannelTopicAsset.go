package databag

import (
  "os"
  "io"
  "strings"
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

  channelSlot, guid, err, code := getChannelSlot(r, true)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  act := &channelSlot.Account

  // check storage
  if full, err := isStorageFull(act); err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  } else if full {
    ErrResponse(w, http.StatusNotAcceptable, errors.New("storage limit reached"))
    return
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

  // can only update topic if creator
  if topicSlot.Topic.Guid != guid {
    ErrResponse(w, http.StatusUnauthorized, errors.New("topic not created by you"))
    return
  }

  // avoid async cleanup of file before record is created
  garbageSync.Lock()
  defer garbageSync.Unlock()

  // save new file
  id := uuid.New().String()
  path := getStrConfigValue(CONFIG_ASSETPATH, APP_DEFAULTPATH) + "/" + channelSlot.Account.Guid + "/" + id
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
  asset.ChannelID = channelSlot.Channel.ID
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
      asset.ChannelID = channelSlot.Channel.ID
      asset.TopicID = topicSlot.Topic.ID
      asset.Status = APP_ASSETWAITING
      asset.TransformId = id
      t := strings.Split(transform, ";")
      if len(t) > 0 {
        asset.Transform = t[0]
      }
      if len(t) > 1 {
        asset.TransformQueue = t[1]
      }
      if len(t) > 2 {
        asset.TransformParams = t[2]
      }
      if res := tx.Save(asset).Error; res != nil {
        return res
      }
      assets = append(assets, Asset{ AssetId: asset.AssetId, Transform: transform, Status: APP_ASSETWAITING})
    }
    if res := tx.Model(&topicSlot.Topic).Update("detail_revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&topicSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&channelSlot.Channel).Update("topic_revision", act.ChannelRevision + 1).Error; res != nil {
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

  // invoke transcoder
  transcode()

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

  // notify
  SetStatus(act)
  for _, card := range cards {
    SetContactChannelNotification(act, &card)
  }

  WriteResponse(w, &assets)
}

func isStorageFull(act *store.Account) (full bool, err error) {

  storage := getNumConfigValue(CONFIG_STORAGE, 0) * 1048576;
  if storage == 0 {
    return
  }

  var assets []store.Asset;
  if err = store.DB.Where("account_id = ?", act.ID).Find(&assets).Error; err != nil {
    return
  }

  var size int64
  for _, asset := range assets {
    size += asset.Size
  }
  if size >= storage {
    full = true
  }

  return
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

