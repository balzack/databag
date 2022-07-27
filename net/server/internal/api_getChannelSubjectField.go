package databag

import (
	"bytes"
	"encoding/base64"
	"github.com/gorilla/mux"
	"github.com/valyala/fastjson"
	"net/http"
	"strings"
	"time"
)

//GetChannelSubjectField retrieve base64 decoded field from channel subject
func GetChannelSubjectField(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	field := params["field"]
	elements := strings.Split(field, ".")

	// get channel stlot
	channelSlot, _, code, err := getChannelSlot(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// decode data
	strData := fastjson.GetString([]byte(channelSlot.Channel.Data), elements...)
	binData, err := base64.StdEncoding.DecodeString(strData)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, err)
		return
	}

	// response with content
	http.ServeContent(w, r, field, time.Unix(channelSlot.Channel.Updated, 0), bytes.NewReader(binData))
}
