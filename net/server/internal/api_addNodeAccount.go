package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"github.com/theckman/go-securerandom"
	"net/http"
	"time"
)

//AddNodeAccount generate a new token to be used for account creation
func AddNodeAccount(w http.ResponseWriter, r *http.Request) {

	if code, err := ParamAdminToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	data, err := securerandom.Bytes(APPCreateSize)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}
	token := hex.EncodeToString(data)

	accountToken := store.AccountToken{
		TokenType: APPTokenCreate,
		Token:     token,
		Expires:   time.Now().Unix() + APPCreateExpire,
	}

	if err := store.DB.Create(&accountToken).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, token)
}
