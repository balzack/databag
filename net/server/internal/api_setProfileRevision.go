package databag

import (
  "net/http"
)

func SetProfileRevision(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
}

func NotifyProfileRevision(token string, revision int64) error {
  return nil
}

