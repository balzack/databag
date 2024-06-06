package databag

import (
	"databag/internal/store"
	"net/http"
)

//GetAccountStatus retrieves account state values
func GetAccountStatus(w http.ResponseWriter, r *http.Request) {

  session, code, err := GetSessionDetail(r)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}
  account := session.Account

	var assets []store.Asset
	if err = store.DB.Where("account_id = ?", account.ID).Find(&assets).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	// construct response
  seal := &Seal{}
  seal.PasswordSalt = account.AccountDetail.SealSalt
  seal.PrivateKeyIV = account.AccountDetail.SealIV
  seal.PrivateKeyEncrypted = account.AccountDetail.SealPrivate
  seal.PublicKey = account.AccountDetail.SealPublic
	status := &AccountStatus{}
	status.StorageAvailable = getNumConfigValue(CNFStorage, 0)
	for _, asset := range assets {
		status.StorageUsed += asset.Size
	}
	status.Disabled = account.Disabled
	status.ForwardingAddress = account.Forward
	status.Searchable = account.Searchable
  status.MFAEnabled = account.MFAEnabled && account.MFAConfirmed
  status.Sealable = true
  status.EnableIce = getBoolConfigValue(CNFEnableIce, false)
  status.AllowUnsealed = getBoolConfigValue(CNFAllowUnsealed, false)
  status.WebPushKey = getStrConfigValue(CNFWebPublicKey, "");
  status.PushEnabled = session.PushEnabled
  status.Seal = seal
	WriteResponse(w, status)
}
