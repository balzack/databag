package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"errors"
	"github.com/gorilla/mux"
	"github.com/theckman/go-securerandom"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func SetCardStatus(w http.ResponseWriter, r *http.Request) {
	var res error

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	cardID := params["cardID"]
	token := r.FormValue("token")

	// scan revisions
	var viewRevision int64
	view := r.FormValue("viewRevision")
	if view != "" {
		if viewRevision, res = strconv.ParseInt(view, 10, 64); res != nil {
			ErrResponse(w, http.StatusBadRequest, res)
			return
		}
	}
	var articleRevision int64
	article := r.FormValue("articleRevision")
	if article != "" {
		if articleRevision, res = strconv.ParseInt(article, 10, 64); res != nil {
			ErrResponse(w, http.StatusBadRequest, res)
			return
		}
	}
	var channelRevision int64
	channel := r.FormValue("channelRevision")
	if channel != "" {
		if channelRevision, res = strconv.ParseInt(channel, 10, 64); res != nil {
			ErrResponse(w, http.StatusBadRequest, res)
			return
		}
	}
	var profileRevision int64
	profile := r.FormValue("profileRevision")
	if profile != "" {
		if profileRevision, res = strconv.ParseInt(profile, 10, 64); res != nil {
			ErrResponse(w, http.StatusBadRequest, res)
			return
		}
	}

	var status string
	if err := ParseRequest(r, w, &status); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}
	if !AppCardStatus(status) {
		ErrResponse(w, http.StatusBadRequest, errors.New("unknown status"))
		return
	}
	if status == APPCardConnected && token == "" {
		ErrResponse(w, http.StatusBadRequest, errors.New("connected token not set"))
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

	// update card
	slot.Revision = account.CardRevision + 1
	if token != "" {
		slot.Card.OutToken = token
	}
	if status == APPCardConnecting {
		if slot.Card.Status != APPCardConnecting && slot.Card.Status != APPCardConnected {
			data, err := securerandom.Bytes(APPTokenSize)
			if err != nil {
				ErrResponse(w, http.StatusInternalServerError, err)
				return
			}
			slot.Card.InToken = hex.EncodeToString(data)
		}
	}
	slot.Card.Status = status
	slot.Card.NotifiedView = viewRevision
	slot.Card.NotifiedArticle = articleRevision
	slot.Card.NotifiedChannel = channelRevision
	slot.Card.NotifiedProfile = profileRevision
	slot.Card.DetailRevision++

	// save and update contact revision
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Save(&slot.Card).Error; res != nil {
			return res
		}
		if res := tx.Preload("Card").Save(&slot).Error; res != nil {
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
