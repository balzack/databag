package databag

import (
	"net/http"
)

func GetNodeConfig(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamAdminToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  // get node config fields
  var config NodeConfig;
  config.Domain = getStrConfigValue(CONFIG_DOMAIN, "");
  config.AccountLimit = getNumConfigValue(CONFIG_ACCOUNTLIMIT, 16);
  config.OpenAccess = getBoolConfigValue(CONFIG_OPENACCESS, true);
  config.AccountStorage = getNumConfigValue(CONFIG_STORAGE, 0);

  WriteResponse(w, config);
}

