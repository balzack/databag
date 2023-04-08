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

type SturnSession struct {
  user string
  auth string
  nonce string
}

type Sturn struct {
  sync sync.Mutex
  sessionId int
  sessions map[string]*SturnSession
  closing bool
  port uint
  relayStart uint
  relayEnd uint
  conn *net.PacketConn
  closed chan bool
  buf []byte
  publicIp string
}

func Listen(port uint, relayStart uint, relayEnd uint) (error) {

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

  sturn := &Sturn{
    sessionId: 0,
    closing: false,
    port: port,
    relayStart: relayStart,
    relayEnd: relayEnd,
    conn: &conn,
    buf: make([]byte, SturnMaxSize),
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
      nonce: "noncynoncenonce",
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
  nonceBin, nonceErr := securerandom.Bytes(SturnNonceSize)
  if nonceErr != nil {
    return nil, nonceErr
  }
  session := &SturnSession{
    user: user,
    auth: hex.EncodeToString(authBin),
    nonce: hex.EncodeToString(nonceBin),
  }
  s.sessions[user] = session
  return session, nil
}

