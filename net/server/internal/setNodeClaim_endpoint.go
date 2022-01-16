package databag

import (
  "errors"
	"net/http"
  "gorm.io/gorm"
  "databag/internal/store"
  "golang.org/x/crypto/bcrypt"
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

  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    LogMsg("SetNodeClaim - invalid credenitals");
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
  if err != nil {
    LogMsg("SetNodeClaim - failed to hash password");
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Create(&store.Config{ConfigId: CONFIG_USERNAME, StrValue: username}).Error; res != nil {
      return res
    }
    if res := tx.Create(&store.Config{ConfigId: CONFIG_PASSWORD, BinValue: hashedPassword}).Error; res != nil {
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

