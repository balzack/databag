package databag

import (
	"net/http"
)

func Authorize(w http.ResponseWriter, r *http.Request) {

  account, code, res := BearerAppToken(r, true);
  if res != nil {
    ErrResponse(w, code, res)
    return
  }
  detail := account.AccountDetail

  // extract token from body
  var token string
  res = ParseRequest(r, w, &token)
  if res != nil {
    ErrResponse(w, http.StatusBadRequest, res)
    return
  }

  // generate auth DataMessage
  auth := Authenticate{ Token: token }
  msg, res := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
    APP_SIGNPKCS1V15, account.Guid, APP_MSGAUTHENTICATE, &auth)
  if res != nil {
    ErrResponse(w, http.StatusInternalServerError, res)
    return
  }

  WriteResponse(w, msg)
}
