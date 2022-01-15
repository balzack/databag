package databag

import (
  "log"
  "encoding/json"
	"net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func SetNodeConfig(w http.ResponseWriter, r *http.Request) {

  // validate login
  if !adminLogin(r) {
    log.Printf("SetNodeConfig - invalid admin credentials");
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  // parse node config
  r.Body = http.MaxBytesReader(w, r.Body, CONFIG_BODYLIMIT)
  dec := json.NewDecoder(r.Body)
  dec.DisallowUnknownFields()
  var config NodeConfig;
  res := dec.Decode(&config);
  if res != nil {
    w.WriteHeader(http.StatusBadRequest)
    return
  }

  // store credentials
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Create(&store.Config{ConfigId: CONFIG_DOMAIN, StrValue: config.Domain}).Error; res != nil {
      return res
    }
    if res := tx.Create(&store.Config{ConfigId: CONFIG_PUBLICLIMIT, NumValue: config.PublicLimit}).Error; res != nil {
      return res
    }
    if res := tx.Create(&store.Config{ConfigId: CONFIG_STORAGE, NumValue: config.AccountStorage}).Error; res != nil {
      return res
    }
    return nil;
  })
  if(err != nil) {
    log.Printf("SetNodeConfig - failed to store config");
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

	w.WriteHeader(http.StatusOK)
}

