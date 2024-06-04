package databag

import (
	"net/http"
)

//GetNodeConfig retreive current admin config
func GetNodeConfig(w http.ResponseWriter, r *http.Request) {

	// validate login
	if code, err := ParamSessionToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	// get node config fields
	var config NodeConfig
	config.Domain = getStrConfigValue(CNFDomain, "")
	config.AccountStorage = getNumConfigValue(CNFStorage, 0)
  config.AllowUnsealed = getBoolConfigValue(CNFAllowUnsealed, false)
  config.EnableImage = getBoolConfigValue(CNFEnableImage, true)
  config.EnableAudio = getBoolConfigValue(CNFEnableAudio, true)
  config.EnableVideo = getBoolConfigValue(CNFEnableVideo, true)
  config.EnableBinary = getBoolConfigValue(CNFEnableBinary, true)
  config.KeyType = getStrConfigValue(CNFKeyType, APPRSA2048)
  config.PushSupported = getBoolConfigValue(CNFPushSupported, true)
  config.EnableIce = getBoolConfigValue(CNFEnableIce, false)
  config.IceService = getStrConfigValue(CNFIceService, "")
	config.IceURL = getStrConfigValue(CNFIceUrl, "")
	config.IceUsername = getStrConfigValue(CNFIceUsername, "")
	config.IcePassword = getStrConfigValue(CNFIcePassword, "")
  config.EnableOpenAccess = getBoolConfigValue(CNFEnableOpenAccess, false);
  config.OpenAccessLimit = getNumConfigValue(CNFOpenAccessLimit, 0);
  config.TransformSupported = getStrConfigValue(CNFScriptPath, "") != "";

	WriteResponse(w, config)
}
