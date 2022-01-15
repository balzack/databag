package databag

import (
  "log"
  "encoding/json"
	"net/http"
)

func GetNodeConfig(w http.ResponseWriter, r *http.Request) {

  // validate login
  if !adminLogin(r) {
    log.Printf("SetNodeConfig - invalid admin credentials");
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  // get node config fields
  var config NodeConfig;
  config.Domain = getStrConfigValue(CONFIG_DOMAIN, "");
  config.PublicLimit = getNumConfigValue(CONFIG_PUBLICLIMIT, 0);
  config.AccountStorage = getNumConfigValue(CONFIG_STORAGE, 0);

  body, err := json.Marshal(config);
  if err != nil {
    log.Println("GetNodeConfig - failed to marshal response");
  }
  w.Write(body);
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}

