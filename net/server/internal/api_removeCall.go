package databag

import (
  "net/http"
  "errors"
  "github.com/gorilla/mux"
)

//RemoveCall adds an active call with ice signal and relay
func RemoveCall(w http.ResponseWriter, r *http.Request) {

  params := mux.Vars(r)
  callId := params["callId"]

  tokenType := ParamTokenType(r)
  if tokenType == APPTokenAgent {
    account, code, err := ParamAgentToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    bridgeRelay.RemoveBridge(account.ID, callId, "");
  } else if tokenType == APPTokenContact {
    card, code, err := ParamContactToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    bridgeRelay.RemoveBridge(card.Account.ID, callId, card.CardSlot.CardSlotID);
  } else {
    err := errors.New("unknown token type")
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }
  WriteResponse(w, nil);
}
