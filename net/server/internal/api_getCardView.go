package databag

import (
  "net/http"
  "databag/internal/store"
)

type cardView struct {
  CardId string
  ProfileRevision int64
  DataRevision int64
  RemoteProfile int64
  RemoteContent int64
}

func GetCardView(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var views []CardView
  if err := store.DB.Model(&store.Card{}).Where("account_id = ?", account.Guid).Find(&views).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, &views)
}
