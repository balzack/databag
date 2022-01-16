package databag

import (
  "encoding/json"
  "net/http"
)

func WriteResponse(w http.ResponseWriter, v interface{}) {
  body, err := json.Marshal(v);
  if err != nil {
    LogMsg("marshal failed")
    w.WriteHeader(http.StatusInternalServerError)
  } else {
    w.Write(body);
    w.Header().Set("Content-Type", "application/json; charset=UTF-8")
    w.WriteHeader(http.StatusOK)
  }
}
