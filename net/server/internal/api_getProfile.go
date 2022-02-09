package databag

import (
  "net/http"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, true);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  WriteResponse(w, getProfileModel(account))
}

