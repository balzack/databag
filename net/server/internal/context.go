package databag

import (
    "errors"
    "gorm.io/gorm"
    "databag/internal/store"
  )

var _configured bool
var _adminUsername string
var _adminPassword []byte
var _nodeDomain string
var _accountStorage int64
var _publicLimit int64

func getStrConfigValue(configId string, empty string) string {
  var config store.Config
  err := store.DB.Where("config_id = ?", config).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.StrValue
}

func getNumConfigValue(configId string, empty int64) int64 {
  var config store.Config
  err := store.DB.Where("config_id = ?", config).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.NumValue
}

func getBoolConfigValue(configId string, empty bool) bool {
  var config store.Config
  err := store.DB.Where("config_id = ?", config).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.BoolValue
}

func getBinConfigValue(configId string, empty []byte) []byte {
  var config store.Config
  err := store.DB.Where("config_id = ?", config).First(&config).Error
  if errors.Is(err, gorm.ErrRecordNotFound) {
    return empty
  }
  return config.BinValue
}
