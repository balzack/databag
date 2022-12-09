package databag

import (
	"databag/internal/store"
	"errors"
	"net/http"
)

//GetProfileMessage get data message for sending profile to federated node
func GetProfileMessage(w http.ResponseWriter, r *http.Request) {
	var code int
	var err error
	tokenType := ParamTokenType(r)

	// load account record
	var account *store.Account
	if tokenType == APPTokenAgent {
		if account, code, err = ParamAgentToken(r, true); err != nil {
			ErrResponse(w, code, err)
			return
		}
	} else if tokenType == APPTokenContact {
		var card *store.Card
		if card, code, err = ParamContactToken(r, true); err != nil {
			ErrResponse(w, code, err)
			return
		}
		account = &card.Account
	} else {
		ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
		return
	}
	detail := &account.AccountDetail

	// generate identity DataMessage
	identity := Identity{
		Revision:    account.ProfileRevision,
		Handle:      account.Username,
		Name:        detail.Name,
		Description: detail.Description,
		Location:    detail.Location,
		Image:       detail.Image,
		Version:     APPVersion,
		Node:        getStrConfigValue(CNFDomain, ""),
    Seal:        detail.SealPublic,
	}
	msg, res := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
		APPSignPKCS1V15, account.GUID, APPMsgIdentity, &identity)
	if res != nil {
		ErrResponse(w, http.StatusInternalServerError, res)
		return
	}

	WriteResponse(w, msg)
}
