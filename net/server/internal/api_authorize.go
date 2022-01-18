package databag

import (
	"net/http"
  "time"
)

func Authorize(w http.ResponseWriter, r *http.Request) {

  account, res := BearerAppToken(r);
  if res != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  if account.Disabled {
    w.WriteHeader(http.StatusGone);
    return
  }

  // extract token from body
  var token string
  if ParseRequest(r, w, &token) != nil {
    w.WriteHeader(http.StatusBadRequest);
    return
  }

  // load details to sign data


  // generate message
  auth := Authenticate{
    Guid: account.Guid,
    Token: token,
    Timestamp: time.Now().Unix(),
  }
  PrintMsg(auth);

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
