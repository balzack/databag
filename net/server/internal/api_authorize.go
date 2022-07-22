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

  var token string
  if err := ParseRequest(r, w, &token); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  claim := &Claim{ Token: token }

  msg, err := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
    APP_SIGNPKCS1V15, account.GUID, APP_MSGAUTHENTICATE, &claim)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, msg)
}

