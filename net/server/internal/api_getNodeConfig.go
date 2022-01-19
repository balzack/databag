package databag

import (
	"net/http"
)

func GetNodeConfig(w http.ResponseWriter, r *http.Request) {

  // validate login
  if err := AdminLogin(r); err != nil {
    ErrResponse(w, http.StatusUnauthorized, err)
    return
  }

  // get node config fields
  var config NodeConfig;
  config.Domain = getStrConfigValue(CONFIG_DOMAIN, "");
  config.PublicLimit = getNumConfigValue(CONFIG_PUBLICLIMIT, 0);
  config.AccountStorage = getNumConfigValue(CONFIG_STORAGE, 0);

  WriteResponse(w, config);
}

