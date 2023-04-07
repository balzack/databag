package databag

import (
//  "encoding/json"
  "sync"
//  "time"
  "fmt"
  "net"
)

var sturn *Sturn
const SturnKeepAlive = 15

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
    buf := make([]byte, 1024)
    n, addr, err := conn.ReadFrom(buf)
		if err != nil {
      fmt.Println(err)
      return
		}

    fmt.Println("GOT STURN MESSAGE: ", n, addr);
  }
  s.closed <- true
}

