package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//SetCardProfile updates public profile of contact
func SetCardProfile(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	cardID := params["cardID"]

	var message DataMessage
	if err := ParseRequest(r, w, &message); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	var identity Identity
	guid, messageType, _, err := ReadDataMessage(&message, &identity)
	if messageType != APPMsgIdentity || err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	slot := store.CardSlot{}
	if err := store.DB.Preload("Card.Groups").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	card := slot.Card
	if card == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced empty card"))
		return
	}
	if card.GUID != guid {
		ErrResponse(w, http.StatusBadRequest, errors.New("invalid profile"))
		return
	}

	card.Username = identity.Handle
	card.Name = identity.Name
	card.Description = identity.Description
	card.Location = identity.Location
	card.Image = identity.Image
	card.Version = identity.Version
	card.Node = identity.Node
	card.ProfileRevision = identity.Revision
  card.Seal = identity.Seal;

	err = store.DB.Transaction(func(tx *gorm.DB) error {

		if res := tx.Save(card).Error; res != nil {
			return res
		}
		slot.Revision = account.CardRevision + 1
		if res := tx.Save(&slot).Error; res != nil {
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
	WriteResponse(w, getCardModel(&slot))
}
