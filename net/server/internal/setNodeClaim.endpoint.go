package databag

import (
  "log"
	"net/http"
  "gorm.io/gorm"
  "databag/internal/store"
  "golang.org/x/crypto/bcrypt"
)

func SetNodeClaim(w http.ResponseWriter, r *http.Request) {

  // confirm node hasn't been configured
  if getBoolConfigValue(CONFIG_CONFIGURED, false) {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  // extract credentials
  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    log.Printf("SetNodeClaim - invalid credenitals");
    w.WriteHeader(http.StatusBadRequest)
    return
  }
  hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
  if err != nil {
    log.Printf("SetNodeClaim - failed to hash password");
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  // store credentials
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
    log.Printf("SetNodeCalim - failed to store credentials");
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

	w.WriteHeader(http.StatusOK)
}

