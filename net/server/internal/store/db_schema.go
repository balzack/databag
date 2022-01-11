package store

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) {
  db.AutoMigrate(&App{});
  db.AutoMigrate(&Account{});
  db.AutoMigrate(&AccountApp{});
}

type Account struct {
  ID                uint    `gorm:"primaryKey;not null;unique;autoIncrement"`
  Did               string  `gorm:"not null"`
  Username          string  `gorm:"not null"`
  Password          string  `gorm:"not null"`
  Salt              string  `gorm:"not null"`
  Name              string
  Description       string
  Location          string
  Image             string
  profileRevision   uint64
  contentRevision   uint64
  viewRevision      uint64
  groupRevision     uint64
  labelRevision     uint64
  cardRevision      uint64
  dialogueRevision  uint64
  insightRevision   uint64
  Created           int64 `gorm:"autoCreateTime"`
  AccountApps       []AccountApp
}

type App struct {
  ID                uint    `gorm:"primaryKey;not null;unique;autoIncrement"`
  Name              string
  Description       string
  Image             string
  Url               string
  Created           int64 `gorm:"autoCreateTime"`
}

type AccountApp struct {
  ID                uint    `gorm:"primaryKey;not null;unique;autoIncrement"`
  AccountID         uint
  AppID             uint
  Token             string  `gorm:"not null"`
  Created           int64 `gorm:"autoCreateTime"`
  App               App
}

