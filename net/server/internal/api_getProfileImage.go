package databag

import (
  "errors"
	"net/http"
  "encoding/base64"
)

func GetProfileImage(w http.ResponseWriter, r *http.Request) {
  var data []byte

  account, code, err := BearerAppToken(r, true);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  if account.AccountDetail.Image == "" {
    ErrResponse(w, http.StatusNotFound, errors.New("profile image not set"))
    return
  }

  data, err = base64.StdEncoding.DecodeString(account.AccountDetail.Image)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, errors.New("profile image not valid"))
    return
  }

  w.Header().Set("Content-Type", http.DetectContentType(data))
  w.Write(data);
}


