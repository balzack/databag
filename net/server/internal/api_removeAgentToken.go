package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
  "errors"
)

//RemoveAgentToken
func RemoveAgentToken(w http.ResponseWriter, r *http.Request) {

  // parse authentication token
  target, access, err := ParseToken(r.FormValue("agent"))
  if err != nil {
    ErrResponse(w, http.StatusBadRequest, err);
    return
  }

  // load session
  var session store.Session
  if err = store.DB.Where("account_id = ? AND token = ?", target, access).Find(&session).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err);
    } else {
      ErrResponse(w, http.StatusInternalServerError, err);
    }
    return;
  }

  // delete session
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Where("session_id = ?", session.ID).Delete(&store.PushEvent{}).Error; res != nil {
      return res
    }
    if res := tx.Where("id = ?", session.ID).Delete(&store.Session{}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

	WriteResponse(w, nil)
}
