package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//GetOpenMessage retrieve message to deliver to contact for connection
func GetOpenMessage(w http.ResponseWriter, r *http.Request) {

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

	if slot.Card.Status != APPCardConnecting && slot.Card.Status != APPCardConnected {
		ErrResponse(w, http.StatusMethodNotAllowed, errors.New("invalid card state"))
		return
	}

	connect := &Connect{
		Contact:         slot.Card.GUID,
		Token:           slot.Card.InToken,
		ArticleRevision: account.ArticleRevision,
		ProfileRevision: account.ProfileRevision,
		ViewRevision:    slot.Card.ViewRevision,
		ChannelRevision: account.ChannelRevision,
		Handle:          account.Username,
		Name:            detail.Name,
		Description:     detail.Description,
		Location:        detail.Location,
		Image:           detail.Image,
		Version:         APPVersion,
		Node:            getStrConfigValue(CNFDomain, ""),
	}

	msg, err := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
		APPSignPKCS1V15, account.GUID, APPMsgConnect, &connect)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, msg)
}
