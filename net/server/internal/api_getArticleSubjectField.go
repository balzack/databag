package databag

import (
	"bytes"
	"databag/internal/store"
	"encoding/base64"
	"errors"
	"github.com/gorilla/mux"
	"github.com/valyala/fastjson"
	"gorm.io/gorm"
	"net/http"
	"strings"
	"time"
)

func GetArticleSubjectField(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	articleID := params["articleID"]
	field := params["field"]
	elements := strings.Split(field, ".")

	var guid string
	var act *store.Account
	tokenType := ParamTokenType(r)
	if tokenType == APPTokenAgent {
		account, code, err := ParamAgentToken(r, false)
		if err != nil {
			ErrResponse(w, code, err)
			return
		}
		act = account
	} else if tokenType == APPTokenContact {
		card, code, err := ParamContactToken(r, true)
		if err != nil {
			ErrResponse(w, code, err)
			return
		}
		act = &card.Account
		guid = card.GUID
	} else {
		ErrResponse(w, http.StatusBadRequest, errors.New("unknown token type"))
		return
	}

	// load article
	var slot store.ArticleSlot
	if err := store.DB.Preload("Article.Groups.Cards").Where("account_id = ? AND article_slot_id = ?", act.ID, articleID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if slot.Article == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced article missing"))
		return
	}

	// check if article is shared
	if tokenType == APPTokenContact && !isArticleShared(guid, slot.Article) {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced article not shared"))
		return
	}

	// decode data
	strData := fastjson.GetString([]byte(slot.Article.Data), elements...)
	binData, err := base64.StdEncoding.DecodeString(strData)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, err)
		return
	}

	// response with content
	http.ServeContent(w, r, field, time.Unix(slot.Article.Updated, 0), bytes.NewReader(binData))
}
