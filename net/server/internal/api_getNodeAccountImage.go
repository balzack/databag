package databag

import (
  "time"
  "strconv"
  "gorm.io/gorm"
  "bytes"
  "errors"
  "encoding/base64"
	"net/http"
  "databag/internal/store"
  "github.com/gorilla/mux"
)

func GetNodeAccountImage(w http.ResponseWriter, r *http.Request) {

  // get referenced account id
  params := mux.Vars(r)
  accountId, res := strconv.ParseUint(params["accountId"], 10, 32)
  if res != nil {
    ErrResponse(w, http.StatusBadRequest, res)
    return
  }

  if err := AdminLogin(r); err != nil {
    ErrResponse(w, http.StatusUnauthorized, err)
    return
  }

  var account store.Account
  if err := store.DB.Preload("AccountDetail").First(&account, uint(accountId)).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }

  if account.AccountDetail.Image == "" {
    ErrResponse(w, http.StatusNotFound, errors.New("iamge not set"))
    return
  }

  data, err := base64.StdEncoding.DecodeString(account.AccountDetail.Image)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, errors.New("image not valid"))
    return
  }

  // response with content
  http.ServeContent(w, r, "image", time.Unix(account.Updated, 0), bytes.NewReader(data))
}

