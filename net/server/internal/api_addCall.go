package databag

import (
  "databag/internal/store"
  "github.com/google/uuid"
  "encoding/hex"
  "github.com/theckman/go-securerandom"
  "gorm.io/gorm"
  "net/http"
  "errors"
)

//AddCall adds an active call with ice signal and relay
func AddCall(w http.ResponseWriter, r *http.Request) {

  account, code, err := ParamAgentToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var cardId string
  if err := ParseRequest(r, w, &cardId); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  // verify card is present
  var cardSlot store.CardSlot
  if err := store.DB.Preload("Card.CardSlot").Where("account_id = ? AND card_slot_id = ?", account.ID, cardId).First(&cardSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if cardSlot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
    return
  }

  // generate call params
  callerBin, callerErr := securerandom.Bytes(APPTokenSize)
  if callerErr != nil {
    ErrResponse(w, http.StatusInternalServerError, callerErr)
    return
  }
  calleeBin, calleeErr := securerandom.Bytes(APPTokenSize)
  if calleeErr != nil {
    ErrResponse(w, http.StatusInternalServerError, calleeErr)
    return
  }
  //turnBin, turnErr := securerandom.Bytes(APPTokenSize)
  //if turnErr != nil {
  //  ErrResponse(w, http.StatusInternalServerError, turnErr)
  //  return
  //}
  callId := uuid.New().String()

  // allocate bridge
  callerToken := hex.EncodeToString(callerBin);
  calleeToken := hex.EncodeToString(calleeBin);
  iceUrl := getStrConfigValue(CNFIceUrl, "")
  iceUsername := getStrConfigValue(CNFIceUsername, "")
  icePassword := getStrConfigValue(CNFIcePassword, "")
  bridgeRelay.AddBridge(account.ID, callId, cardId, callerToken, calleeToken);

  // create response
  call := Call{
    Id: callId,
    CardId: cardId,
    CallerToken: callerToken,
    CalleeToken: calleeToken,
    IceUrl: iceUrl,
    IceUsername: iceUsername,
    IcePassword: icePassword,
    KeepAlive: BridgeKeepAlive,
  }
  WriteResponse(w, call);
}
