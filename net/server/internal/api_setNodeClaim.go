package databag

import (
  "errors"
	"net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func SetNodeClaim(w http.ResponseWriter, r *http.Request) {

  var config store.Config
  err := store.DB.Where("config_id = ?", CONFIG_CONFIGURED).First(&config).Error
  if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  if config.BoolValue {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  username, password, res := BasicCredentials(r);
  if res != nil {
    LogMsg("invalid credenitals");
    w.WriteHeader(http.StatusBadRequest)
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Create(&store.Config{ConfigId: CONFIG_USERNAME, StrValue: username}).Error; res != nil {
      return res
    }
    if res := tx.Create(&store.Config{ConfigId: CONFIG_PASSWORD, BinValue: password}).Error; res != nil {
      return res
    }
    if res := tx.Create(&store.Config{ConfigId: CONFIG_CONFIGURED, BoolValue: true}).Error; res != nil {
      return res
    }
    return nil;
  })
  if(err != nil) {
    LogMsg("SetNodeCalim - failed to store credentials");
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

	w.WriteHeader(http.StatusOK)
}

