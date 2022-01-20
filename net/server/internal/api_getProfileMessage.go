package databag

import (
  "net/http"
)

func GetProfileMessage(w http.ResponseWriter, r *http.Request) {

  account, code, res := BearerAppToken(r, true);
  if res != nil {
    ErrResponse(w, code, res)
    return
  }
  detail := account.AccountDetail

  // generate identity DataMessage
  identity := Identity{
    Revision: account.ProfileRevision,
    Handle: account.Username,
    Name: detail.Name,
    Description: detail.Description,
    Location: detail.Location,
    Image: detail.Image,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, "") + "/",
  }
  msg, res := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
    APP_SIGNPKCS1V15, account.Guid, APP_MSGIDENTITY, &identity)
  if res != nil {
    ErrResponse(w, http.StatusInternalServerError, res)
    return
  }

  WriteResponse(w, msg)
}

