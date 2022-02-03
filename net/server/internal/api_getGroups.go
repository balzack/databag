package databag

import (
  "strconv"
  "net/http"
  "databag/internal/store"
)

func GetGroups(w http.ResponseWriter, r *http.Request) {
  var res error
  var groupRevision int64

  group := r.FormValue("groupRevision")
  if group != "" {
    if groupRevision, res = strconv.ParseInt(group, 10, 64); res != nil {
      ErrResponse(w, http.StatusBadRequest, res)
      return
    }
  }

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var slots []store.GroupSlot
  if err := store.DB.Preload("Group").Where("account_id = ? AND revision > ?", account.ID, groupRevision).Find(&slots).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var groups []*Group
  for _, slot := range slots {
    groups = append(groups, getGroupModel(&slot))
  }
  WriteResponse(w, groups)
}

