package databag

import (
	"net/http"
  "encoding/hex"
  "time"
  "databag/internal/store"
	"github.com/theckman/go-securerandom"
)

func AddNodeAccount(w http.ResponseWriter, r *http.Request) {

  if code, err := ParamAdminToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  data, err := securerandom.Bytes(APP_CREATESIZE)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  token := hex.EncodeToString(data)

  accountToken := store.AccountToken{
    TokenType: APP_TOKENCREATE,
    Token: token,
    Expires: time.Now().Unix() + APP_CREATEEXPIRE,
  };

  if err := store.DB.Create(&accountToken).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, token);
}

