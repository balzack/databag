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
  detail := account.AccountDetail

  profile := &Profile{
    Guid: account.Guid,
    Handle: account.Username,
    Description: detail.Description,
    Location: detail.Location,
    Image: detail.Image,
    Revision: account.ProfileRevision,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, "") + "/",
  }

  WriteResponse(w, profile)
}

