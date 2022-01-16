package databag

import (
	"net/http"
)

func GetNodeConfig(w http.ResponseWriter, r *http.Request) {

  // validate login
  if !adminLogin(r) {
    LogMsg("SetNodeConfig - invalid admin credentials");
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  // get node config fields
  var config NodeConfig;
  config.Domain = getStrConfigValue(CONFIG_DOMAIN, "");
  config.PublicLimit = getNumConfigValue(CONFIG_PUBLICLIMIT, 0);
  config.AccountStorage = getNumConfigValue(CONFIG_STORAGE, 0);

  WriteResponse(w, config);
}

