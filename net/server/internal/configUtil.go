package databag

import (
    "errors"
    "gorm.io/gorm"
    "databag/internal/store"
  )

const CONFIG_OPENACCESS = "open_access"
const CONFIG_ACCOUNTLIMIT = "account_limit"
const CONFIG_CONFIGURED = "configured"
const CONFIG_USERNAME = "username"
const CONFIG_PASSWORD = "password"
const CONFIG_DOMAIN = "domain"
const CONFIG_STORAGE = "storage"
const CONFIG_ASSETPATH = "asset_path"
const CONFIG_SCRIPTPATH = "script_path"

func getStrConfigValue(configId string, empty string) string {
  var config store.Config
  err := store.DB.Where("config_id = ?", configId).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.StrValue
}

func getNumConfigValue(configId string, empty int64) int64 {
  var config store.Config
  err := store.DB.Where("config_id = ?", configId).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.NumValue
}

func getBoolConfigValue(configId string, empty bool) bool {
  var config store.Config
  err := store.DB.Where("config_id = ?", configId).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.BoolValue
}

func getBinConfigValue(configId string, empty []byte) []byte {
  var config store.Config
  err := store.DB.Where("config_id = ?", configId).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.BinValue
}
