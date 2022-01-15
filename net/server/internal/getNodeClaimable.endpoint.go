package databag

import (
  "log"
  "encoding/json"
	"net/http"
)

func GetNodeClaimable(w http.ResponseWriter, r *http.Request) {

  c := getBoolConfigValue(CONFIG_CONFIGURED, false);
  body, err := json.Marshal(!c);
  if err != nil {
    log.Println("GetNodeClaimable - failed to marshal response");
  }
  w.Write(body);
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
}

