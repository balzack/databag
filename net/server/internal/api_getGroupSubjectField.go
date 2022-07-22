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

func GetGroupSubjectField(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	groupID := params["groupID"]
	field := params["field"]
	elements := strings.Split(field, ".")

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// load group
	var slot store.GroupSlot
	if err := store.DB.Preload("Group.GroupData").Where("account_id = ? AND group_slot_id = ?", account.ID, groupID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if slot.Group == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced group missing"))
		return
	}

	// decode data
	strData := fastjson.GetString([]byte(slot.Group.GroupData.Data), elements...)
	binData, err := base64.StdEncoding.DecodeString(strData)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, err)
		return
	}

	// response with content
	http.ServeContent(w, r, field, time.Unix(slot.Group.Updated, 0), bytes.NewReader(binData))
}
