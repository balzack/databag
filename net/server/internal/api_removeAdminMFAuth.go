package databag

import (
	"net/http"
  "databag/internal/store"
  "gorm.io/gorm"
  "gorm.io/gorm/clause"
)

//Disable multi-factor auth for admin
func RemoveAdminMFAuth(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamSessionToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  err := store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"bool_value"}),
    }).Create(&store.Config{ConfigID: CNFMFAConfirmed, BoolValue: false}).Error; res != nil {
      return res
    }
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"bool_value"}),
    }).Create(&store.Config{ConfigID: CNFMFAEnabled, BoolValue: false}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

	WriteResponse(w, nil)
}
