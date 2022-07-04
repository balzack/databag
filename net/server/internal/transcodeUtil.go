package databag

import (
  "os"
  "io"
  "hash/crc32"
  "errors"
  "bytes"
  "sync"
  "regexp"
  "databag/internal/store"
  "os/exec"
  "gorm.io/gorm"
)

var audioSync sync.Mutex
var videoSync sync.Mutex
var photoSync sync.Mutex
var defaultSync sync.Mutex

func transcode() {
  go transcodeAudio()
  go transcodeVideo()
  go transcodePhoto()
  go transcodeDefault()
}

func transcodeVideo() {
  videoSync.Lock()
  defer videoSync.Unlock()
  for ;; {
    var asset store.Asset
    if err := store.DB.Order("created asc").Preload("Account").Preload("Channel.Cards").Preload("Channel.Groups.Cards").Preload("Channel.ChannelSlot").Preload("Topic.TopicSlot").Where("transform_queue = ? AND status = ?", APP_QUEUEVIDEO, APP_ASSETWAITING).First(&asset).Error; err != nil {
      if !errors.Is(err, gorm.ErrRecordNotFound) {
        ErrMsg(err)
      }
      return
    }
    transcodeAsset(&asset)
  }
}

func transcodeAudio() {
  audioSync.Lock()
  defer audioSync.Unlock()
  for ;; {
    var asset store.Asset
    if err := store.DB.Order("created asc").Preload("Account").Preload("Channel.Cards").Preload("Channel.Groups.Cards").Preload("Channel.ChannelSlot").Preload("Topic.TopicSlot").Where("transform_queue = ? AND status = ?", APP_QUEUEAUDIO, APP_ASSETWAITING).First(&asset).Error; err != nil {
      if !errors.Is(err, gorm.ErrRecordNotFound) {
        ErrMsg(err)
      }
      return
    }
    transcodeAsset(&asset)
  }
}

func transcodePhoto() {
  photoSync.Lock()
  defer photoSync.Unlock()
  for ;; {
    var asset store.Asset
    if err := store.DB.Order("created asc").Preload("Account").Preload("Channel.Cards").Preload("Channel.Groups.Cards").Preload("Channel.ChannelSlot").Preload("Topic.TopicSlot").Where("transform_queue = ? AND status = ?", APP_QUEUEPHOTO, APP_ASSETWAITING).First(&asset).Error; err != nil {
      if !errors.Is(err, gorm.ErrRecordNotFound) {
        ErrMsg(err)
      }
      return
    }
    transcodeAsset(&asset)
  }
}

func transcodeDefault() {
  defaultSync.Lock()
  defer defaultSync.Unlock()
  for ;; {
    var asset store.Asset
    if err := store.DB.Order("created asc").Preload("Account").Preload("Channel.Cards").Preload("Channel.Groups.Cards").Preload("Channel.ChannelSlot").Preload("Topic.TopicSlot").Where("transform_queue != ? AND transform_queue != ? AND transform_queue != ? AND status = ?", APP_QUEUEVIDEO, APP_QUEUEAUDIO, APP_QUEUEPHOTO, APP_ASSETWAITING).First(&asset).Error; err != nil {
      if !errors.Is(err, gorm.ErrRecordNotFound) {
        ErrMsg(err)
      }
      return
    }
    transcodeAsset(&asset)
  }
}

func transcodeAsset(asset *store.Asset) {

  // prepare script path
  data := getStrConfigValue(CONFIG_ASSETPATH, APP_DEFAULTPATH)
  script := getStrConfigValue(CONFIG_SCRIPTPATH, ".")
  re := regexp.MustCompile("^[a-zA-Z0-9_]*$")

  if !re.MatchString(asset.Transform) {
    ErrMsg(errors.New("invalid transform"))
    if err := UpdateAsset(asset, APP_ASSETERROR, 0, 0); err != nil {
      ErrMsg(err)
    }
  } else {
    input := data + "/" + asset.Account.Guid + "/" + asset.TransformId
    output := data + "/" + asset.Account.Guid + "/" + asset.AssetId
    cmd := exec.Command(script + "/transform_" + asset.Transform + ".sh", input, output, asset.TransformParams)
    var stdout bytes.Buffer
    cmd.Stdout = &stdout
    var stderr bytes.Buffer
    cmd.Stderr = &stderr

    if err := cmd.Run(); err != nil {
      LogMsg(stdout.String())
      LogMsg(stderr.String())
      ErrMsg(err)
      if err := UpdateAsset(asset, APP_ASSETERROR, 0, 0); err != nil {
        ErrMsg(err)
      }
    } else {
      if stdout.Len() > 0 {
        LogMsg(stdout.String())
      }
      if stderr.Len() > 0 {
        LogMsg(stderr.String())
      }
      crc, size, err := ScanAsset(output)

      if err != nil {
        ErrMsg(err)
        if err := UpdateAsset(asset, APP_ASSETERROR, 0, 0); err != nil {
          ErrMsg(err)
        }
      } else if err := UpdateAsset(asset, APP_ASSETREADY, crc, size); err != nil {
        ErrMsg(err)
      }
    }
  }
}

func UpdateAsset(asset *store.Asset, status string, crc uint32, size int64) (err error) {

  topic := store.Topic{};
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    asset.Crc = crc
    asset.Size = size
    asset.Status = status
    if res := tx.Model(store.Asset{}).Where("id = ?", asset.ID).Updates(asset).Error; res != nil {
      return res
    }
    if asset.Topic != nil {
      if res := tx.Preload("Account").Preload("TopicSlot").Preload("Channel.Groups").Preload("Channel.Cards").Preload("Channel.ChannelSlot").First(&topic, asset.Topic.ID).Error; res != nil {
        return res;
      }
      if res := tx.Model(&topic).Update("detail_revision", topic.Account.ChannelRevision + 1).Error; res != nil {
        return res
      }
      if res := tx.Model(&topic.TopicSlot).Update("revision", topic.Account.ChannelRevision + 1).Error; res != nil {
        return res
      }
      if res := tx.Model(&topic.Channel).Update("topic_revision", topic.Account.ChannelRevision + 1).Error; res != nil {
        return res
      }
      if res := tx.Model(&topic.Channel.ChannelSlot).Update("revision", topic.Account.ChannelRevision + 1).Error; res != nil {
        return res
      }
      if res := tx.Model(&topic.Account).Update("channel_revision", topic.Account.ChannelRevision + 1).Error; res != nil {
        return res
      }
    }
    return nil
  })
  if err != nil {
    return
  }

  // determine affected contact list
  cards := make(map[string]store.Card)
  for _, card := range topic.Channel.Cards {
    cards[card.Guid] = card
  }
  for _, group := range topic.Channel.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = card
    }
  }

  // notify
  SetStatus(&topic.Account)
  for _, card := range cards {
    SetContactChannelNotification(&topic.Account, &card)
  }

  return
}

func ScanAsset(path string) (crc uint32, size int64, err error) {

  file, res := os.Open(path)
  if res != nil {
    err = res
    return
  }
  defer file.Close()

  // prepare hash
  table := crc32.MakeTable(crc32.IEEE)

  // compute has as data is saved
  data := make([]byte, 4096)
  for {
    n, res := file.Read(data)
    if res != nil {
      if res == io.EOF {
        break
      }
      err = res
      return
    }

    crc = crc32.Update(crc, table, data[:n])
  }

  // read size
  info, ret := file.Stat()
  if ret != nil {
    err = ret
    return
  }
  size = info.Size()
  return
}

