package databag

import (
	"net/http"
)

//GetNodeConfig retreive current admin config
func GetNodeConfig(w http.ResponseWriter, r *http.Request) {

	// validate login
	if code, err := ParamAdminToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	// get node config fields
	var config NodeConfig
	config.Domain = getStrConfigValue(CNFDomain, "")
	config.AccountStorage = getNumConfigValue(CNFStorage, 0)
  config.AllowUnsealed = getBoolConfigValue(CNFAllowUnsealed, true)
  config.EnableImage = getBoolConfigValue(CNFEnableImage, true)
  config.EnableAudio = getBoolConfigValue(CNFEnableAudio, true)
  config.EnableVideo = getBoolConfigValue(CNFEnableVideo, true)
  config.KeyType = getStrConfigValue(CNFKeyType, APPRSA4096)
  config.PushSupported = getBoolConfigValue(CNFPushSupported, true)
  config.EnableIce = getBoolConfigValue(CNFEnableIce, false)
	config.IceUrl = getStrConfigValue(CNFIceUrl, "")
	config.IceUsername = getStrConfigValue(CNFIceUsername, "")
	config.IcePassword = getStrConfigValue(CNFIcePassword, "")
  config.EnableOpenAccess = getBoolConfigValue(CNFEnableOpenAccess, false);
  config.OpenAccessLimit = getNumConfigValue(CNFOpenAccessLimit, 0);

	WriteResponse(w, config)
}
