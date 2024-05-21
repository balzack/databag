package databag

import (
	"net/http"
)

//GetAdminMFAuth checks if mfa enabled for admin
func GetAdminMFAuth(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamSessionToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  enabled := getBoolConfigValue(CNFMFAEnabled, false);
  confirmed := getBoolConfigValue(CNFMFAConfirmed, false);

	WriteResponse(w, enabled && confirmed)
}
