package databag

import (
	"github.com/gorilla/websocket"
  "encoding/json"
	"net/http"
  "errors"
)

var bridgeRelay BridgeRelay;
var relayUpgrader = websocket.Upgrader{}

//Status handler for websocket connection
func Signal(w http.ResponseWriter, r *http.Request) {

	// accept websocket connection
	conn, err := relayUpgrader.Upgrade(w, r, nil)
	if err != nil {
		ErrMsg(err)
		return
	}
	defer conn.Close()
	conn.SetReadLimit(APPBodyLimit)

	// receive announce
	t, m, res := conn.ReadMessage()
	if res != nil {
		ErrMsg(res)
		return
	}
	if t != websocket.TextMessage {
		ErrMsg(errors.New("invalid websocket message type"))
		return
	}
	var a Announce
	if err := json.Unmarshal(m, &a); err != nil {
		ErrMsg(err)
		return
	}

  // bind connection to bridge
  bridgeRelay.SetConnection(conn, a.AppToken);

  for true {
    t, m, res := conn.ReadMessage()
    if res != nil {
      ErrMsg(res)
      break
    }
    if t != websocket.TextMessage {
      ErrMsg(errors.New("invalid websocket message type"))
      break
    }
    bridgeRelay.RelayMessage(conn, m);
	}

  // release connection from bridge
  bridgeRelay.ClearConnection(conn);
}

