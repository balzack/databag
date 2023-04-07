package sturn

import (
  "net"
  "fmt"
)

func readMessage(buf []byte) (error, *SturnMessage) {
  return nil, nil
}


func writeMessage(msg *SturnMessage, buf []byte) (error, int) {
  return nil, 0
}

func (s *Sturn) handleMessage(buf []byte, addr net.Addr) {

  err, msg := readMessage(buf);
  if err != nil {
    fmt.Println(err);
    return
  }
  if msg == nil {
    return
  }

  if msg.class == CLSRequest && msg.method == MEHBinding {
    err := s.handleBindingRequest(msg, addr);
    if err != nil {
      fmt.Println(err);
    }
  } else if msg.class == CLSRequest && msg.method == MEHAllocate {
    err := s.handleAllocateRequest(msg, addr);
    if err != nil {
      fmt.Println(err);
    }
  } else {
    fmt.Println("unsupported message", buf);
  }

  fmt.Println("STURN>", addr, buf);
}

func (s *Sturn) handleBindingRequest(msg *SturnMessage, addr net.Addr) (error) {
  return nil
}

func (s *Sturn) handleAllocateRequest(msg *SturnMessage, addr net.Addr) (error) {
  return nil
}

