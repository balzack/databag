package databag

import (
  "net/http"
)

//KeepCall keeps call and signaling alive
func KeepCall(w http.ResponseWriter, r *http.Request) {

  account, code, err := ParamAgentToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var callId string
  if err := ParseRequest(r, w, &callId); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  bridgeRelay.KeepAlive(account.ID, callId);
  WriteResponse(w, nil);
}

