package databag

import (
  "strconv"
	"net/http"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetNodeAccountStatus(w http.ResponseWriter, r *http.Request) {

  // get referenced account id
  params := mux.Vars(r)
  accountID, res := strconv.ParseUint(params["accountID"], 10, 32)
  if res != nil {
    ErrResponse(w, http.StatusBadRequest, res)
    return
  }

  if code, err := ParamAdminToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  var flag bool
  if err := ParseRequest(r, w, &flag); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  if err := store.DB.Model(store.Account{}).Where("id = ?", accountID).Update("disabled", flag).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, nil)
}

