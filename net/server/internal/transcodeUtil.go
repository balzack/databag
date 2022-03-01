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

var transcodeSync sync.Mutex

func transcode() {

  transcodeSync.Lock()
  defer transcodeSync.Unlock()

  var assets []store.Asset
  if err := store.DB.Preload("Account").Preload("Channel.Cards").Preload("Channel.Groups.Cards").Preload("Channel.ChannelSlot").Preload("Topic.TopicSlot").Where("status = ?", APP_ASSETWAITING).Find(&assets).Error; err != nil {
    ErrMsg(err)
    return
  }

  // prepare script path
  data := getStrConfigValue(CONFIG_ASSETPATH, ".")
  script := getStrConfigValue(CONFIG_SCRIPTPATH, ".")
  re := regexp.MustCompile("^[a-zA-Z0-9_]*$")

  for _, asset := range assets {

    if !re.MatchString(asset.Transform) {
      ErrMsg(errors.New("invalid transformi"))
      if err := UpdateAsset(&asset, APP_ASSETERROR, 0, 0); err != nil {
        ErrMsg(err)
      }
    } else {
      input := data + "/" + asset.TransformId
      output := data + "/" + asset.AssetId
      cmd := exec.Command(script + "/" + asset.Transform + ".sh", input, output)
      var out bytes.Buffer
      cmd.Stdout = &out
      if err := cmd.Run(); err != nil {
        LogMsg(out.String())
        ErrMsg(err)
        if err := UpdateAsset(&asset, APP_ASSETERROR, 0, 0); err != nil {
          ErrMsg(err)
        }
      } else {
        LogMsg(out.String())
        crc, size, err := ScanAsset(output)
        if err != nil {
          ErrMsg(err)
          if err := UpdateAsset(&asset, APP_ASSETERROR, 0, 0); err != nil {
            ErrMsg(err)
          }
        } else if err := UpdateAsset(&asset, APP_ASSETREADY, crc, size); err != nil {
          ErrMsg(err)
        }
      }
    }
  }
}

func isComplete(status string, asset *store.Asset) (complete bool, err error) {
  if status == APP_ASSETREADY {
    var assets []store.Asset
    if err = store.DB.Where("topic_id = ?", asset.Topic.ID).Find(&assets).Error; err != nil {
      return
    }
    for _, a := range asset.Topic.Assets {
      if a.ID != asset.ID && asset.Status != APP_ASSETREADY {
        return
      }
    }
    complete = true
    return
  }
  return
}

func UpdateAsset(asset *store.Asset, status string, crc uint32, size int64) (err error) {

  act := asset.Account
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    asset.Crc = crc
    asset.Size = size
    asset.Status = status
    if res := tx.Save(asset).Error; res != nil {
      return res
    }
    complete, ret := isComplete(status, asset)
    if ret != nil {
      return ret
    }
    if complete {
      if res := tx.Model(&asset.Topic).Update("transform", APP_TRANSFORMCOMPLETE).Error; res != nil {
        return res
      }
    }
    if res := tx.Model(&asset.Topic).Update("detail_revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&asset.Topic.TopicSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&asset.Channel.ChannelSlot).Update("revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&act).Update("channel_revision", act.ChannelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    return
  }

  // determine affected contact list
  cards := make(map[string]store.Card)
  for _, card := range asset.Channel.Cards {
    cards[card.Guid] = card
  }
  for _, group := range asset.Channel.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = card
    }
  }

  // notify
  SetStatus(&act)
  for _, card := range cards {
    SetContactChannelNotification(&act, &card)
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

