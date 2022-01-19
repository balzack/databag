package databag

import (
  "net/url"
  "net/http"
  "net/http/httptest"
  "github.com/gorilla/websocket"
)

type StatusHandler struct {}

func (h *StatusHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  Status(w, r)
}

func getTestWebsocket() *websocket.Conn {
  h := StatusHandler{}
  s := httptest.NewServer(&h)
  wsUrl, _ := url.Parse(s.URL)
  wsUrl.Scheme = "ws"
  ws, _, err := websocket.DefaultDialer.Dial(wsUrl.String(), nil)
  if err != nil {
    PrintMsg(err.Error());
  }
  return ws
}
