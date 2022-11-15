package databag

import (
	"net/http"
)

//Authorize confirm account authorization with signed data message
func Authorize(w http.ResponseWriter, r *http.Request) {

	account, code, res := ParamAgentToken(r, true)
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

	claim := &Claim{Token: token}

	msg, err := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
		APPSignPKCS1V15, account.GUID, APPMsgAuthenticate, &claim)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, msg)
}
