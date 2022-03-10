package databag

import (
	"net/http"
  "databag/internal/store"
)

func GetNodeAccounts(w http.ResponseWriter, r *http.Request) {

  if err := AdminLogin(r); err != nil {
    ErrResponse(w, http.StatusUnauthorized, err)
    return
  }

  var accounts []store.Account
  if err := store.DB.Preload("AccountDetail").Find(&accounts).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  profiles := []AccountProfile{}
  for _, account := range accounts {
    profiles = append(profiles, AccountProfile{
      AccountId: uint32(account.ID),
      Guid: account.Guid,
      Handle: account.Username,
      Name: account.AccountDetail.Name,
      Description: account.AccountDetail.Description,
      Location: account.AccountDetail.Location,
      ImageSet: account.AccountDetail.Image != "",
      Disabled: account.Disabled,
    })
  }

  WriteResponse(w, &profiles);
}

