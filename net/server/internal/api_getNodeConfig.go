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
  config.Domain = getStrConfigValue(CNFDomain, "");
  config.AccountLimit = getNumConfigValue(CNFAccountLimit, 16);
  config.OpenAccess = getBoolConfigValue(CNFOpenAccess, true);
  config.AccountStorage = getNumConfigValue(CNFStorage, 0);

  WriteResponse(w, config);
}

