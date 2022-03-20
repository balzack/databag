package databag

import (
  "net/http"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {

  account, code, err := ParamAgentToken(r, true);
  if err != nil {
PrintMsg(r);
    ErrResponse(w, code, err)
    return
  }

  WriteResponse(w, getProfileModel(account))
}

