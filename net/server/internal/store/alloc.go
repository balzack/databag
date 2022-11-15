package store

import (
  "gorm.io/gorm"
  "gorm.io/gorm/logger"
  "gorm.io/driver/sqlite"
)

var DB *gorm.DB;

func SetPath(path string) {
  db, err := gorm.Open(sqlite.Open(path), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Info),
  })
  if err != nil {
    panic("failed to connect database")
  }
  AutoMigrate(db)
  DB = db
}

