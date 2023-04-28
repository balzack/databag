package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
)

//SetChannelRevision notifies contact of updated channel revision
func SetChannelRevision(w http.ResponseWriter, r *http.Request) {

	card, code, err := ParamContactToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var revision int64
	if err := ParseRequest(r, w, &revision); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	if err := NotifyChannelRevision(card, revision); err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, nil)
}

//NotifyChannelRevision stores updated channel revision
func NotifyChannelRevision(card *store.Card, revision int64) error {

	act := &card.Account
	err := store.DB.Transaction(func(tx *gorm.DB) error {
    cardRevision := act.CardRevision+1;
		if res := tx.Model(&store.Card{}).Where("id = ?", card.ID).Update("notified_channel", revision).Error; res != nil {
			return res
		}
		if res := tx.Model(&store.CardSlot{}).Where("id = ?", card.CardSlot.ID).Update("revision", cardRevision).Error; res != nil {
			return res
		}
		if res := tx.Model(&store.Account{}).Where("id = ?", act.ID).Update("card_revision", cardRevision).Error; res != nil {
			return res
		}
    act.CardRevision = cardRevision;
		return nil
	})
	if err != nil {
		return err
	}
	SetStatus(act)
	return nil
}
