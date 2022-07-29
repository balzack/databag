package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//SetCardGroup assigns contact to sharing group
func SetCardGroup(w http.ResponseWriter, r *http.Request) {
	account, code, err := BearerAppToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	cardID := params["cardID"]
	groupID := params["groupID"]

	// load referenced card
	var slot store.CardSlot
	if err := store.DB.Preload("Card").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if slot.Card == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
		return
	}

	// load referenced group
	var groupSlot store.GroupSlot
	if err := store.DB.Preload("Group").Where("account_id = ? AND group_slot_id = ?", account.ID, groupID).First(&groupSlot).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			ErrResponse(w, http.StatusNotFound, err)
		}
		return
	}
	if groupSlot.Group == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced deleted group"))
		return
	}

	// save and update revision
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Model(&slot.Card).Association("Groups").Append(groupSlot.Group); res != nil {
			return res
		}
		if res := tx.Model(&slot.Card).Update("detail_revision", slot.Card.DetailRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&slot.Card).Update("view_revision", slot.Card.ViewRevision+1).Error; res != nil {
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

	SetContactViewNotification(account, slot.Card)
	SetStatus(account)
	WriteResponse(w, getCardModel(&slot))
}
