package store

import (
  "fmt"
  "gorm.io/gorm"
  "gorm.io/gorm/logger"
  "gorm.io/gorm/clause"
  "github.com/glebarez/sqlite"
)

var DB *gorm.DB;

func SetPath(path string) {
  db, err := gorm.Open(sqlite.Open(path + "/databag.db"), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Silent),
  })
  if err != nil {
    fmt.Println(err);
    panic("failed to connect database")
  }
  AutoMigrate(db)

  // upsert key type
  err = db.Transaction(func(tx *gorm.DB) error {
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&Config{ConfigID: "asset_path", StrValue: path + "/assets"}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    fmt.Println(err);
    panic("failed to set database path")
  }

  DB = db
}

