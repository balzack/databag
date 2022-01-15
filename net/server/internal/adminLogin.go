package databag

import (
	"net/http"
  "golang.org/x/crypto/bcrypt"
)

func adminLogin(r *http.Request) bool {

  // extract request auth
  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    return false
  }

  // nothing to do if not configured
  if !getBoolConfigValue(CONFIG_CONFIGURED, false) {
    return false;
  }

  // compare username
  if getStrConfigValue(CONFIG_USERNAME, "") != username {
    return false
  }

  // compare password
  p := getBinConfigValue(CONFIG_PASSWORD, nil);
  if bcrypt.CompareHashAndPassword(p, []byte(password)) != nil {
    return false
  }

  return true;
}

