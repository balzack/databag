package databag

import (
  "sync"
  "os"
  "databag/internal/store"
)

var garbageSync sync.Mutex

func garbageCollect(act *store.Account) {
  garbageSync.Lock()
  defer garbageSync.Unlock()

  // get all asset files
  dir := getStrConfigValue(CNFAssetPath, APPDefaultPath) + "/" + act.GUID
  files, err := os.ReadDir(dir)
  if err != nil {
    ErrMsg(err)
    return
  }

  // create map of all files
  list := make(map[string]bool)
  for _, file := range files {
     list[file.Name()] = false
  }

  // get all asset records
  var assets []store.Asset
  if err := store.DB.Where("account_id = ?", act.ID).Find(&assets).Error; err != nil {
    ErrMsg(err)
    return
  }

  // mark all referenced files
  for _, asset := range assets {
    list[asset.AssetID] = true
  }

  // delete any unreferenced file
  for id, set := range list {
    if !set {
      LogMsg("removing file asset " + act.GUID + "/" + id)
      if err := os.Remove(dir + "/" + id); err != nil {
        ErrMsg(err)
      }
    }
  }
}

