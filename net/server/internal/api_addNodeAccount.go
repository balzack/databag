package databag

import (
	"net/http"
  "databag/internal/store"
	"github.com/theckman/go-securerandom"
)

func AddNodeAccount(w http.ResponseWriter, r *http.Request) {

  if !AdminLogin(r) {
    LogMsg("invalid admin credentials");
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  data, err := securerandom.Base64OfBytes(32)
  if err != nil {
    LogMsg("failed to generate token");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }

  token := store.AccountToken{TokenType: "create", Token: data };
  if res := store.DB.Create(&token).Error; res != nil {
    LogMsg("failed to store token");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }

  WriteResponse(w, data);
}

