package databag

import (
  "log"
  "encoding/json"
	"net/http"
  "databag/internal/store"
	"github.com/theckman/go-securerandom"
)

func AddNodeAccount(w http.ResponseWriter, r *http.Request) {

  // validate login
  if !adminLogin(r) {
    log.Printf("AddNodeAccount - invalid admin credentials");
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  data, err := securerandom.Base64OfBytes(32)
  if err != nil {
    log.Println("AddNodeAccount - failed to generate token");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }

  token := store.AccountToken{TokenType: "create", Token: data };
  if res := store.DB.Create(&token).Error; res != nil {
    log.Println("AddNodeAccount - failed to store token");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }

  body, err := json.Marshal(data);
  if err != nil {
    log.Println("GetNodeConfig - failed to marshal response");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }
  w.Write(body)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}

