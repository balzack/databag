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
)

//AddMultiFactorAuth enables multi-factor auth on the given account
func AddMultiFactorAuth(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

  key, err := totp.Generate(totp.GenerateOpts{
    Issuer: APPMFAIssuer,
    AccountName: account.Handle,
    Digits: otp.DigitsSix,
    Algorithm: otp.AlgorithmSHA256,
  })

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    account.MFAConfirmed = false
    if res := tx.Model(account).Update("mfa_confirmed", account.MFAConfirmed).Error; res != nil {
      ErrResponse(w, http.StatusInternalServerError, res)
      return res
    }
    account.MFAEnabled = true
    if res := tx.Model(account).Update("mfa_enabled", account.MFAEnabled).Error; res != nil {
      ErrResponse(w, http.StatusInternalServerError, res)
      return res
    }
    account.MFASecret = key.Secret()
    if res := tx.Model(account).Update("mfa_secret", account.MFASecret).Error; res != nil {
      ErrResponse(w, http.StatusInternalServerError, res)
      return res
    }
    account.AccountRevision += 1;
    if res := tx.Model(&account).Update("account_revision", account.AccountRevision).Error; res != nil {
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

	SetStatus(account)
	WriteResponse(w, MFASecret{ Image: "data:image/png;base64," + enc, Text: account.MFASecret })
}
