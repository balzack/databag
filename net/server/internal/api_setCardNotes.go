package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//SetCardNotes assignes notes to contact in account
func SetCardNotes(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	cardID := params["cardID"]

	var notes string
	if err := ParseRequest(r, w, &notes); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	// load referenced card
	var slot store.CardSlot
	if err := store.DB.Preload("Card.Groups").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
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

	// save and update contact revision
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		slot.Card.Notes = notes
		slot.Card.DetailRevision++
		if res := tx.Save(&slot.Card).Error; res != nil {
			return res
		}
		if res := tx.Model(&slot).Update("revision", account.CardRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("card_revision", account.CardRevision+1).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	SetStatus(account)
	WriteResponse(w, getCardDetailModel(&slot))
}
