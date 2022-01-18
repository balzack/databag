package databag

import (
	"net/http"
  "encoding/hex"
  "time"
  "databag/internal/store"
	"github.com/theckman/go-securerandom"
)

func AddNodeAccount(w http.ResponseWriter, r *http.Request) {

  if !AdminLogin(r) {
    LogMsg("invalid admin credentials");
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  data, err := securerandom.Bytes(16)
  if err != nil {
    LogMsg("failed to generate token");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }
  token := hex.EncodeToString(data)

  accountToken := store.AccountToken{
    TokenType: "create",
    Token: token,
    Expires: time.Now().Unix() + APP_CREATEEXPIRE,
  };

  if store.DB.Create(&accountToken).Error != nil {
    LogMsg("failed to store token");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }

  WriteResponse(w, token);
}

