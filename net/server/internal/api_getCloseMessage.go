package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

func GetCloseMessage(w http.ResponseWriter, r *http.Request) {

	account, code, res := ParamAgentToken(r, true)
	if res != nil {
		ErrResponse(w, code, res)
		return
	}
	detail := account.AccountDetail
	cardID := mux.Vars(r)["cardID"]

	var slot store.CardSlot
	if err := store.DB.Preload("Card").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			ErrResponse(w, http.StatusNotFound, err)
		}
		return
	}
	if slot.Card == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
		return
	}

	if slot.Card.Status == APPCardConnecting || slot.Card.Status == APPCardConnected {
		ErrResponse(w, http.StatusMethodNotAllowed, errors.New("invalid card state"))
		return
	}

	disconnect := &Disconnect{
		Contact: slot.Card.GUID,
	}

	msg, err := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
		APPSignPKCS1V15, account.GUID, APPMsgDisconnect, &disconnect)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, msg)
}
