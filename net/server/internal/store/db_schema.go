package store

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) {
  db.AutoMigrate(&Account{});
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
  Created           int64   `gorm:"autoCreateTime"`
  profileRevision   uint64
  contentRevision   uint64
  viewRevision      uint64
  groupRevision     uint64
  labelRevision     uint64
  cardRevision      uint64
  dialogueRevision  uint64
  insightRevision   uint64
}

