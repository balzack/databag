package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"github.com/theckman/go-securerandom"
	"net/http"
	"time"
)

func AddAccountAuthentication(w http.ResponseWriter, r *http.Request) {

	account, err := AccountLogin(r)
	if err != nil {
		ErrResponse(w, http.StatusUnauthorized, err)
		return
	}

	data, res := securerandom.Bytes(APPResetSize)
	if res != nil {
		ErrResponse(w, http.StatusInternalServerError, res)
		return
	}
	token := hex.EncodeToString(data)

	accountToken := store.AccountToken{
		AccountID: account.ID,
		TokenType: APPTokenReset,
		Token:     token,
		Expires:   time.Now().Unix() + APPResetExpire,
	}
	if err := store.DB.Create(&accountToken).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, token)
}
