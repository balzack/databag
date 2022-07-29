package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
)

//SetArticleRevision notifies contact of updated article revision
func SetArticleRevision(w http.ResponseWriter, r *http.Request) {

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

	if err := NotifyArticleRevision(card, revision); err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, nil)
}

//NotifyArticleRevision sets article revision of contact
func NotifyArticleRevision(card *store.Card, revision int64) error {

	act := &card.Account
	err := store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Model(card).Where("id = ?", card.ID).Update("notified_article", revision).Error; res != nil {
			return res
		}
		if res := tx.Model(&card.CardSlot).Where("id = ?", card.CardSlot.ID).Update("revision", act.CardRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(act).Where("id = ?", act.ID).Update("card_revision", act.CardRevision+1).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		return err
	}
	SetStatus(act)
	return nil
}
