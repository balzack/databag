package databag

import (
  "net/http"
  "databag/internal/store"
)

func GetGroups(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var storeGroups []store.Group
  if err := store.DB.Where("account_id = ?", account.ID).Find(&storeGroups).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var groups []*Group
  for _, group := range storeGroups {
    groups = append(groups, getGroupModel(&group))
  }
  WriteResponse(w, groups)
}

