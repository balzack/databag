package databag

import (
  "github.com/gorilla/websocket"
  "encoding/json"
  "sync"
  "time"
)

var bridgeRelay BridgeRelay;
const BridgeKeepAlive = 15

type BridgeStatus struct {
  Status string `json:"status"`
}

type Bridge struct {
  accountId uint
  callId string
  cardId string
  expires int64
  closed bool
  callerToken string
  calleeToken string
  caller *websocket.Conn
  callee *websocket.Conn
}

type BridgeRelay struct {
  sync sync.Mutex
  bridges []*Bridge
}

func (s *BridgeRelay) AddBridge(accountId uint, callId string, callerToken string, calleeToken string) {
  s.sync.Lock()
  defer s.sync.Unlock()
  bridge := &Bridge{
    accountId: accountId,
    callId: callId,
    expires: time.Now().Unix() + (BridgeKeepAlive * 3),
    closed: false,
    callerToken: callerToken,
    calleeToken: calleeToken,
  }
  s.bridges = append(s.bridges, bridge)
}

func setStatus(bridge *Bridge, status string) {
  msg, _ := json.Marshal(BridgeStatus{ Status: status })
  if bridge.caller != nil {
    if err := bridge.caller.WriteMessage(websocket.TextMessage, msg); err != nil {
      LogMsg("failed to notify bridge status");
    }
  }
  if bridge.callee != nil {
    if err := bridge.callee.WriteMessage(websocket.TextMessage, msg); err != nil {
      LogMsg("failed to notify bridge status");
    }
  }
}

func (s *BridgeRelay) KeepAlive(accountId uint, callId string) {
  s.sync.Lock()
  defer s.sync.Unlock()
  now := time.Now().Unix()
  var bridges []*Bridge
  for _, bridge := range s.bridges {
    if bridge.expires > now {
      bridges = append(bridges, bridge)
      if bridge.callId == callId && bridge.accountId == accountId {
        bridge.expires = now + (BridgeKeepAlive * 3)
        if bridge.caller != nil {
          if err := bridge.caller.WriteMessage(websocket.PingMessage, nil); err != nil {
            LogMsg("failed to ping caller signal");
          }
        }
        if bridge.callee != nil {
          if err := bridge.callee.WriteMessage(websocket.PingMessage, nil); err != nil {
            LogMsg("failed to ping callee signal");
          }
        }
      }
    } else {
      setStatus(bridge, "closed");
    }
  }
  s.bridges = bridges
}

func (s *BridgeRelay) RemoveBridge(accountId uint, callId string, cardId string) {
  s.sync.Lock()
  defer s.sync.Unlock()
  var bridges []*Bridge
  for _, bridge := range s.bridges {
    if bridge.callId == callId && bridge.accountId == accountId && (bridge.cardId == cardId || cardId == "") {
      setStatus(bridge, "closed");
    } else {
      bridges = append(bridges, bridge)
    }
  }
  s.bridges = bridges
}

func (s *BridgeRelay) SetConnection(conn *websocket.Conn, token string) {
  s.sync.Lock()
  defer s.sync.Unlock()
  for _, bridge := range s.bridges {
    if bridge.callerToken == token {
      bridge.caller = conn
      if bridge.caller != nil && bridge.callee != nil {
        setStatus(bridge, "connected")
      } else {
        setStatus(bridge, "connecting")
      }
    }
    if bridge.calleeToken == token {
      bridge.callee = conn
      if bridge.caller != nil && bridge.callee != nil {
        setStatus(bridge, "connected")
      } else {
        setStatus(bridge, "connecting")
      }
    }
	}
}

func (s *BridgeRelay) ClearConnection(conn *websocket.Conn) {
  s.sync.Lock()
  defer s.sync.Unlock()
  for _, bridge := range s.bridges {
    if bridge.caller == conn {
      bridge.caller = nil
      setStatus(bridge, "connecting")
    }
    if bridge.callee == conn {
      bridge.callee = nil
      setStatus(bridge, "connecting")
    }
	}
}

func (s *BridgeRelay) RelayMessage(conn *websocket.Conn, msg []byte) {
  s.sync.Lock()
  defer s.sync.Unlock()
  for _, bridge := range s.bridges {
    if bridge.caller == conn && bridge.callee != nil {
      if err := bridge.callee.WriteMessage(websocket.TextMessage, msg); err != nil {
        LogMsg("failed to relay to callee");
      }
    }
    if bridge.callee == conn && bridge.caller != nil {
      if err := bridge.caller.WriteMessage(websocket.TextMessage, msg); err != nil {
        LogMsg("failed to relay to caller");
      }
    }
  }
}

