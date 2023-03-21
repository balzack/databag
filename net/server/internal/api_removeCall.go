package databag

import (
  "net/http"
  "errors"
)

//RemoveCall adds an active call with ice signal and relay
func RemoveCall(w http.ResponseWriter, r *http.Request) {

  var callId string
  if err := ParseRequest(r, w, &callId); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

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
