package store

import (
  "fmt"
  "gorm.io/gorm"
  "gorm.io/gorm/logger"
  "gorm.io/gorm/clause"
  "github.com/glebarez/sqlite"
)

var DB *gorm.DB;

func SetPath(storePath string, transformPath string) {
  db, err := gorm.Open(sqlite.Open(storePath + "/databag.db"), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Silent),
  })
  if err != nil {
    fmt.Println(err);
    panic("failed to connect database")
  }
  AutoMigrate(db)

  // upsert asset path
  err = db.Transaction(func(tx *gorm.DB) error {
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&Config{ConfigID: "asset_path", StrValue: storePath}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    fmt.Println(err);
    panic("failed to set database path")
  }

  // upsert script path
  err = db.Transaction(func(tx *gorm.DB) error {
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&Config{ConfigID: "script_path", StrValue: transformPath}).Error; res != nil {
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

