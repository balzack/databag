package databag

import (
	"bytes"
	"databag/internal/store"
	"encoding/base64"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"time"
)

//GetCardProfileImage retrieves contacts profile image
func GetCardProfileImage(w http.ResponseWriter, r *http.Request) {
	var data []byte

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}
	cardID := mux.Vars(r)["cardID"]

	var slot store.CardSlot
	if err := store.DB.Preload("Card.Groups").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if slot.Card == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced missing card"))
		return
	}
	if slot.Card.Image == "" {
		ErrResponse(w, http.StatusNotFound, errors.New("card image not set"))
		return
	}
	data, err = base64.StdEncoding.DecodeString(slot.Card.Image)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, errors.New("invalid card image"))
		return
	}

	// response with content
	http.ServeContent(w, r, "image", time.Unix(slot.Card.Updated, 0), bytes.NewReader(data))
}
