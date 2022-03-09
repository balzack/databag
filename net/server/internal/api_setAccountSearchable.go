package databag

import (
  "net/http"
  "databag/internal/store"
)

func SetAccountSearchable(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var flag bool
  if err := ParseRequest(r, w, &flag); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  if err = store.DB.Model(account).Update("searchable", flag).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, nil)
}

