package databag

import (
	"errors"
	"github.com/gorilla/websocket"
	"net/http"
)

var relayer = websocket.Upgrader{}
var left *websocket.Conn
var right *websocket.Conn
var cur bool = false

//Status handler for websocket connection
func Relay(w http.ResponseWriter, r *http.Request) {

	// accept websocket connection
	conn, err := relayer.Upgrade(w, r, nil)
	if err != nil {
		ErrMsg(err)
		return
	}
  if (cur) {
    right = conn;
    PrintMsg("CONNECTED RIGHT");
  } else {
    left = conn;
    PrintMsg("CONNECTED LEFT");
  }
  cur = !cur;

	defer conn.Close()
	conn.SetReadLimit(APPBodyLimit)

  for true {
    t, m, res := conn.ReadMessage()
    if res != nil {
      ErrMsg(res)
      return
    }
    if t != websocket.TextMessage {
      ErrMsg(errors.New("invalid websocket message type"))
      return
    }
    if conn == left {
      if err := right.WriteMessage(websocket.TextMessage, m); err != nil {
        ErrMsg(err)
        return
      }
    }
    if conn == right {
      if err := left.WriteMessage(websocket.TextMessage, m); err != nil {
        ErrMsg(err)
        return
      }
    }
  }
}

