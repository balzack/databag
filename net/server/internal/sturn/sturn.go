package sturn

import (
//  "encoding/json"
  "sync"
//  "time"
  "fmt"
  "net"
)

var sturn *Sturn
const SturnKeepAlive = 3600
const SturnMaxSize = 1024
const SturnMaxBindFail = 16

type SturnSession struct {
}

type Sturn struct {
  sync sync.Mutex
  sessions []*SturnSession
  port uint
  relayStart uint
  relayEnd uint
  conn *net.PacketConn
  closed chan bool
  buf []byte
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

  fmt.Println("STARTED STURN SERVER")

  sturn := &Sturn{
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

  // TODO terminate all sessions

  s.closed <- true
}

