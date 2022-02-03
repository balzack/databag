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

  var slots []store.GroupSlot
  if err := store.DB.Where("account_id = ?", account.ID).Find(&slots).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var groups []*Group
  for _, slot := range slots {
    groups = append(groups, getGroupModel(&slot))
  }
  WriteResponse(w, groups)
}

