package databag

import (
  "bytes"
	"net/http"
	"image/png"
  "github.com/pquerna/otp"
  "github.com/pquerna/otp/totp"
  "databag/internal/store"
  "encoding/base64"
  "gorm.io/gorm"
  "gorm.io/gorm/clause"
)

//AddAdminMFAuth enables multi-factor auth on the given account
func AddAdminMFAuth(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamSessionToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  key, err := totp.Generate(totp.GenerateOpts{
    Issuer: APPMFAIssuer,
    AccountName: "admin",
    Digits: otp.DigitsSix,
    Algorithm: otp.AlgorithmSHA256,
  })

  err = store.DB.Transaction(func(tx *gorm.DB) error {

    // upsert mfa enabled
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"bool_value"}),
    }).Create(&store.Config{ConfigID: CNFMFAEnabled, BoolValue: false}).Error; res != nil {
      return res
    }

    // upsert mfa confirmed
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"bool_value"}),
    }).Create(&store.Config{ConfigID: CNFMFAConfirmed, BoolValue: true}).Error; res != nil {
      return res
    }

    // upsert mfa secret
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&store.Config{ConfigID: CNFMFASecret, StrValue: key.Secret()}).Error; res != nil {
      return res
    }

    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var buf bytes.Buffer
	img, err := key.Image(200, 200)
	if err != nil {
		panic(err)
	}
	png.Encode(&buf, img)
  enc := base64.StdEncoding.EncodeToString(buf.Bytes())

	WriteResponse(w, MFASecret{ Image: "data:image/png;base64," + enc, Text: key.Secret() })
}
