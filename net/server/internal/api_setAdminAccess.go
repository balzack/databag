package databag

import (
  "encoding/hex"
  "github.com/theckman/go-securerandom"
	"databag/internal/store"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"net/http"
)

//SetAdminAccess begins a session for admin access
func SetAdminAccess(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamAdminToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  // gernate app token
  data, err := securerandom.Bytes(APPTokenSize)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  access := hex.EncodeToString(data)

	err = store.DB.Transaction(func(tx *gorm.DB) error {
    // upsert mfa enabled
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&store.Config{ConfigID: CNFAdminSession, StrValue: access}).Error; res != nil {
      return res
    }
		return nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

  WriteResponse(w, access)
}
