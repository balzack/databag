package databag

import (
	"databag/internal/store"
	"errors"
	"gorm.io/gorm"
	"net/http"
	"time"
)

//SetCloseMessage delivers disconnection message to contact
func SetCloseMessage(w http.ResponseWriter, r *http.Request) {

	var message DataMessage
	if err := ParseRequest(r, w, &message); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	var disconnect Disconnect
	guid, messageType, ts, err := ReadDataMessage(&message, &disconnect)
	if messageType != APPMsgDisconnect || err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}
	if ts+APPConnectExpire < time.Now().Unix() {
		ErrResponse(w, http.StatusBadRequest, errors.New("message has expired"))
		return
	}

	// load referenced account
	var account store.Account
	if err := store.DB.Where("guid = ?", disconnect.Contact).First(&account).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}

	// see if card exists
	var card store.Card
	if err := store.DB.Preload("CardSlot").Where("account_id = ? AND guid = ?", account.GUID, guid).First(&card).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			WriteResponse(w, nil)
		}
		return
	}

	slot := card.CardSlot
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if card.Status != APPCardPending {
			if res := tx.Model(&card).Update("status", APPCardConfirmed).Error; res != nil {
				return res
			}
      if res := tx.Model(&card).Update("status_updated", time.Now().Unix()).Error; res != nil {
        return res
      }
		}
		if res := tx.Model(&card).Update("detail_revision", account.CardRevision+1).Error; res != nil {
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

	SetStatus(&account)
	WriteResponse(w, nil)
}
