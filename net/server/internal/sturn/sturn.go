package sturn

import (
//  "encoding/json"
  "encoding/hex"
  "sync"
  "github.com/theckman/go-securerandom"
//  "time"
  "errors"
  "fmt"
  "net"
)

var sturn *Sturn
const SturnKeepAlive = 3600
const SturnMaxSize = 1024
const SturnMaxBindFail = 16
const SturnNonceSize = 8
const SturnPassSize = 8

type SturnAllocation struct {
  source string
  transaction []byte
  response []byte
  port int
}

type SturnSession struct {
  user string
  auth string
  allocations []*SturnAllocation
}

type Sturn struct {
  sync sync.Mutex
  sessionId int
  sessions map[string]*SturnSession
  closing bool
  port int
  conn *net.PacketConn
  closed chan bool
  buf []byte
  publicIp string
  relayStart int
  relayCount int
  relayPorts map[int]bool
  relayIndex int
}

func Listen(port int, relayStart int, relayCount int) (error) {

  if (sturn != nil) {
    (*sturn.conn).Close()
    <-sturn.closed
    sturn = nil
  }

  address := fmt.Sprintf(":%d", port)
	conn, err := net.ListenPacket("udp", address)
	if err != nil {
    return err
	}

  relayPorts := make(map[int]bool)
  for i := 0; i < relayCount; i++ {
	  relayPorts[i] = true
	}

  sturn = &Sturn{
    sessionId: 0,
    closing: false,
    port: port,
    relayStart: relayStart,
    relayCount: relayCount,
    relayPorts: relayPorts,
    conn: &conn,
    buf: make([]byte, SturnMaxSize),
    sessions: make(map[string]*SturnSession),
  }

  go sturn.serve(conn);
  return nil
}

func Close() {
  if (sturn != nil) {
    (*sturn.conn).Close()
    <-sturn.closed
    sturn = nil
  }
}

func (s *Sturn) serve(conn net.PacketConn) {
  for {
    buf := make([]byte, SturnMaxSize)
    n, addr, err := conn.ReadFrom(buf)
		if err != nil {
      fmt.Println(err)
      return
		}
    s.handleMessage(buf[:n], addr);
  }

  s.sync.Lock()
  s.closing = true
  for _, session := range s.sessions {
    // TODO cleanup session
    fmt.Println(session)
  }
  s.sync.Unlock()

  s.closed <- true
}

func TestSession() {
  if sturn != nil {
    sturn.sync.Lock()
    defer sturn.sync.Unlock()
    if sturn.closing {
      return
    }
    session := &SturnSession{
      user: "user",
      auth: "pass",
    }
    sturn.sessions["user"] = session
  }
}

func (s *Sturn) addSession() (*SturnSession, error) {
  s.sync.Lock()
  defer s.sync.Unlock()
  if !s.closing {
    return nil, errors.New("closing sturn")
  }
  s.sessionId += 1
  user := fmt.Sprintf("%08d", s.sessionId)
  authBin, authErr := securerandom.Bytes(SturnPassSize)
  if authErr != nil {
    return nil, authErr
  }
  session := &SturnSession{
    user: user,
    auth: hex.EncodeToString(authBin),
  }
  s.sessions[user] = session
  return session, nil
}

func (s *Sturn) getRelayPort() (int, error) {
  s.relayIndex += 1;
  for i := 0; i < s.relayCount; i++ {
    key := (i + s.relayIndex) % s.relayCount;
    if s.relayPorts[key] {
      s.relayPorts[key] = false
      return s.relayStart + key, nil
    }
  }
  return 0, errors.New("no available relay port")
}

func (s *Sturn) setRelayPort(port int) {
  key := port - s.relayStart
  s.relayPorts[key] = true
}

