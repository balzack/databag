package store

import (
  "fmt"
  "gorm.io/gorm"
  "gorm.io/gorm/logger"
  "github.com/glebarez/sqlite"
)

var DB *gorm.DB;

func SetPath(path string) {
  db, err := gorm.Open(sqlite.Open(path), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Silent),
  })
  if err != nil {
    fmt.Println(err);
    panic("failed to connect database")
  }
  AutoMigrate(db)
  DB = db
}

