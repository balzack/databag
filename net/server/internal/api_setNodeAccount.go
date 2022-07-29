package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"github.com/gorilla/mux"
	"github.com/theckman/go-securerandom"
	"net/http"
	"strconv"
	"time"
)

//SetNodeAccount creates token to reset account credentials
func SetNodeAccount(w http.ResponseWriter, r *http.Request) {

	// get referenced account id
	params := mux.Vars(r)
	accountID, res := strconv.ParseUint(params["accountID"], 10, 32)
	if res != nil {
		ErrResponse(w, http.StatusBadRequest, res)
		return
	}

	if code, res := ParamAdminToken(r); res != nil {
		ErrResponse(w, code, res)
		return
	}

	data, err := securerandom.Bytes(APPResetSize)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}
	token := hex.EncodeToString(data)

	accountToken := store.AccountToken{
		TokenType: APPTokenReset,
		Token:     token,
		AccountID: uint(accountID),
		Expires:   time.Now().Unix() + APPResetExpire,
	}

	if err := store.DB.Create(&accountToken).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, token)
}
