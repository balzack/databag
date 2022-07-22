package databag

import (
    "errors"
    "gorm.io/gorm"
    "databag/internal/store"
  )

const CONFIG_OPENACCESS = "open_access"
const CONFIG_ACCOUNTLIMIT = "account_limit"
const CONFIG_CONFIGURED = "configured"
const CONFIG_TOKEN = "token"
const CONFIG_DOMAIN = "domain"
const CONFIG_STORAGE = "storage"
const CONFIG_ASSETPATH = "asset_path"
const CONFIG_SCRIPTPATH = "script_path"

func getStrConfigValue(configID string, empty string) string {
  var config store.Config
  err := store.DB.Where("config_id = ?", configID).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.StrValue
}

func getNumConfigValue(configID string, empty int64) int64 {
  var config store.Config
  err := store.DB.Where("config_id = ?", configID).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.NumValue
}

func getBoolConfigValue(configID string, empty bool) bool {
  var config store.Config
  err := store.DB.Where("config_id = ?", configID).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.BoolValue
}

func getBinConfigValue(configID string, empty []byte) []byte {
  var config store.Config
  err := store.DB.Where("config_id = ?", configID).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.BinValue
}
