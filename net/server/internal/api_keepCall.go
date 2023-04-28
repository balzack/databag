package databag

import (
  "net/http"
  "github.com/gorilla/mux"
)

//KeepCall keeps call and signaling alive
func KeepCall(w http.ResponseWriter, r *http.Request) {

  account, code, err := ParamAgentToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  params := mux.Vars(r)
  callId := params["callId"]

  bridgeRelay.KeepAlive(account.ID, callId);
  WriteResponse(w, nil);
}

