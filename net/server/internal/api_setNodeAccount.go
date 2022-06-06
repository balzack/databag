package databag

import (
	"net/http"
  "encoding/hex"
  "time"
  "strconv"
  "github.com/gorilla/mux"
  "databag/internal/store"
	"github.com/theckman/go-securerandom"
)

func SetNodeAccount(w http.ResponseWriter, r *http.Request) {

  // get referenced account id
  params := mux.Vars(r)
  accountId, res := strconv.ParseUint(params["accountId"], 10, 32)
  if res != nil {
    ErrResponse(w, http.StatusBadRequest, res)
    return
  }

  if code, res := ParamAdminToken(r); res != nil {
    ErrResponse(w, code, res)
    return
  }

  data, err := securerandom.Bytes(APP_RESETSIZE)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  token := hex.EncodeToString(data)

  accountToken := store.AccountToken{
    TokenType: APP_TOKENRESET,
    Token: token,
    AccountID: uint(accountId),
    Expires: time.Now().Unix() + APP_CREATEEXPIRE,
  };

  if err := store.DB.Create(&accountToken).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, token);
}

