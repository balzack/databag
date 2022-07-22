package databag

import (
  "net/http"
  "time"
  "strconv"
  "encoding/hex"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
  "github.com/gorilla/mux"
)

func AddNodeAccountAccess(w http.ResponseWriter, r *http.Request) {

  params := mux.Vars(r)
  accountID, res := strconv.ParseUint(params["accountID"], 10, 32)
  if res != nil {
    ErrResponse(w, http.StatusBadRequest, res)
    return
  }

  if code, err := ParamAdminToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  data, ret := securerandom.Bytes(APPResetSize)
  if ret != nil {
    ErrResponse(w, http.StatusInternalServerError, ret)
    return
  }
  token := hex.EncodeToString(data)

  accountToken := store.AccountToken{
    AccountID: uint(accountID),
    TokenType: APPTokenReset,
    Token: token,
    Expires: time.Now().Unix() + APPResetExpire,
  }
  if err := store.DB.Create(&accountToken).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, token)
}



