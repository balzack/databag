package databag

import (
	"net/http"
  "gorm.io/gorm"
  "gorm.io/gorm/clause"
  "databag/internal/store"
)

func SetNodeConfig(w http.ResponseWriter, r *http.Request) {

  // validate login
  if err := AdminLogin(r); err != nil {
    ErrResponse(w, http.StatusUnauthorized, err)
    return
  }

  // parse node config
  var config NodeConfig
  if err := ParseRequest(r, w, &config); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  // store credentials
  err := store.DB.Transaction(func(tx *gorm.DB) error {

    // upsert domain config
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&store.Config{ConfigId: CONFIG_DOMAIN, StrValue: config.Domain}).Error; res != nil {
      return res
    }

    // upsert public limit config
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"num_value"}),
    }).Create(&store.Config{ConfigId: CONFIG_PUBLICLIMIT, NumValue: config.PublicLimit}).Error; res != nil {
      return res
    }

    // upsert account storage config
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"num_value"}),
    }).Create(&store.Config{ConfigId: CONFIG_STORAGE, NumValue: config.AccountStorage}).Error; res != nil {
      return res
    }

    return nil;
  })
  if(err != nil) {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

	w.WriteHeader(http.StatusOK)
}

