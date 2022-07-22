package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "databag/internal/store"
  "github.com/gorilla/mux"
)

func GetAccountListingMessage(w http.ResponseWriter, r *http.Request) {

  // get referenced account guid
  params := mux.Vars(r)
  guid := params["guid"]

  var account store.Account
  if err := store.DB.Preload("AccountDetail").Where("guid = ? AND searchable = ? AND disabled = ?", guid, true, false).First(&account).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  detail := account.AccountDetail;

  // generate identity DataMessage
  identity := Identity{
    Revision: account.ProfileRevision,
    Handle: account.Username,
    Name: detail.Name,
    Description: detail.Description,
    Location: detail.Location,
    Image: detail.Image,
    Version: APPVersion,
    Node: getStrConfigValue(CNFDomain, ""),
  }
  msg, res := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
    APPSignPKCS1V15, account.GUID, APPMsgIdentity, &identity)
  if res != nil {
    ErrResponse(w, http.StatusInternalServerError, res)
    return
  }

  WriteResponse(w, msg)
}

