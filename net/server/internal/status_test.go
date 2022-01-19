package databag

import (
  "net/url"
  "net/http"
  "net/http/httptest"
)

type StatusHandler struct {}

func (h *StatusHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  Status(w, r)
}

func StartTestWebsocketServer() string {
  h := StatusHandler{}
  s := httptest.NewServer(&h)
  wsUrl, _ := url.Parse(s.URL)
  wsUrl.Scheme = "ws"
  return wsUrl.String()
}
