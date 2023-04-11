package sturn

import (
  "net"
  "fmt"
  "errors"
  "bytes"
  "strings"
  "strconv"
)

func readMessage(buf []byte) (error, *SturnMessage) {
  if len(buf) < 20 {
    return errors.New("invalid header size"), nil
  }
  if buf[0] & 0xC0 != 0 {
    return errors.New("invalid message prefix"), nil
  }
  magic := []byte{0x21, 0x12, 0xA4, 0x42 }
  if !bytes.Equal(magic, buf[4:8]) {
    return errors.New("invalid message cookie"), nil
  }
  atrLength := int(buf[2]) * 256 + int(buf[3])
  if atrLength + 20 != len(buf) {
    return errors.New("invalid message length"), nil
  }

  class, method := getMessageType(buf[0], buf[1]);
  transaction := buf[8:20];

  var attributes []SturnAttribute
  var pos int = 0
  for pos < atrLength {
    err, attr, n := readAttribute(buf, pos + 20)
    if err != nil {
      return err, nil
    }
    pos += n
    attributes = append(attributes, *attr);
  }

  return nil, &SturnMessage{
    class: class,
    method: method,
    transaction: transaction,
    attributes: attributes,
  }
}

func writeMessage(msg *SturnMessage, buf []byte) (error, int) {
  if len(buf) < 20 {
    return errors.New("invalid buffer length"), 0
  }

  // set prefix
  buf[0], buf[1] = setMessageType(msg.class, msg.method)

  // init size
  buf[2] = 0x00
  buf[3] = 0x00

  // set cookie
  buf[4] = 0x21
  buf[5] = 0x12
  buf[6] = 0xA4
  buf[7] = 0x42

  // set transaction
  for i := 0; i < 12; i++ {
    buf[8 + i] = msg.transaction[i];
  }

  // set each attribute
  pos := 0
  for _, attribute := range msg.attributes {
    err, n := writeAttribute(&attribute, buf, 20 + pos);
    if err != nil {
      return err, 0
    }
    pos += n;

    // set size
    buf[2] = byte((pos >> 8) % 256);
    buf[3] = byte(pos % 256);
  }

  return nil, pos + 20;
}

func (s *Sturn) handleMessage(buf []byte, addr net.Addr) {

  err, msg := readMessage(buf);
  if err != nil {
    fmt.Println(addr.String(), buf);
    fmt.Println(err);
    return
  }
  if msg == nil {
    return
  }

  if msg.class == CLSRequest && msg.method == MEHBinding {
    fmt.Println("stun/turn binding request");
    s.handleBindingRequest(msg, addr);
  } else if msg.class == CLSRequest && msg.method == MEHAllocate {
    fmt.Println("stun/turn allocate request");
    s.handleAllocateRequest(msg, addr);
  } else if msg.class == CLSRequest && msg.method == MEHRefresh {
    fmt.Println("stun/turn refresh request");
    s.handleRefreshRequest(msg, addr);
  } else if msg.class == CLSRequest && msg.method == MEHCreatePermission {
    fmt.Println("stun/turn create permission request");
    s.handleCreatePermissionRequest(msg, addr);
  } else if msg.class == CLSIndication && msg.method == MEHSend {
    fmt.Println("stun/turn send");
    s.handleSendIndication(msg, addr);
  } else {
    fmt.Println("unsupported message", buf);
  }
}

func (s *Sturn) sendRequestError(msg *SturnMessage, addr net.Addr, code int32) {
  var attributes []SturnAttribute
  attributes = append(attributes, SturnAttribute{
    atrType: ATRErrorCode,
    intValue: code,
  })
  attributes = append(attributes, SturnAttribute{
    atrType: ATRNonce,
    strValue: "",
  })
  attributes = append(attributes, SturnAttribute{
    atrType: ATRRealm,
    strValue: "databag.dweb",
  })
  response := &SturnMessage{
    class: CLSError,
    method: msg.method,
    transaction: msg.transaction,
    attributes: attributes,
  };
  err, n := writeMessage(response, s.buf);
  if err != nil {
    fmt.Printf("failed to write stun response");
  } else {
    (*s.conn).WriteTo(s.buf[:n], addr);
  }
}

func (s *Sturn) handleCreatePermissionRequest(msg *SturnMessage, addr net.Addr) {

  username := getAttribute(msg, ATRUsername)
  if username == nil {
    fmt.Println("no username", addr.String(), msg.transaction);
    s.sendRequestError(msg, addr, 401)
    return
  }
  permission := getAttribute(msg, ATRXorPeerAddress)
  if permission == nil {
    fmt.Println("no peer");
    s.sendRequestError(msg, addr, 400)
    return
  }

  s.sync.Lock();
  defer s.sync.Unlock();
  session, set := sturn.sessions[username.strValue]
  if !set {
    fmt.Println("no session", addr.String());
    s.sendRequestError(msg, addr, 401)
    return
  }

  source := addr.String()
  allocation, found := session.allocations[source]
  if !found {
    fmt.Println("no allocation");
    s.sendRequestError(msg, addr, 400)
    return
  }

  allocation.permissions = append(allocation.permissions, permission.strValue);
  fmt.Println("---> ", allocation.port, allocation.permissions);

  var attributes []SturnAttribute
  attributes = append(attributes, SturnAttribute{
    atrType: ATRMessageIntegrity,
  });

  response := &SturnMessage{
    class: CLSResponse,
    method: MEHCreatePermission,
    transaction: msg.transaction,
    attributes: attributes,
  };
  err, n := writeMessage(response, s.buf);
  if err != nil {
    fmt.Printf("failed to write stun response");
  } else {
    (*s.conn).WriteTo(s.buf[:n], addr);
  }
  return
}

func (s *Sturn) handleSendIndication(msg *SturnMessage, addr net.Addr) {
//  fmt.Println(addr.String(), msg);
}

func (s *Sturn) handleBindingRequest(msg *SturnMessage, addr net.Addr) {

  address := strings.Split(addr.String(), ":")
  ip := address[0];
  port, _ := strconv.Atoi(address[1]);
  var attributes []SturnAttribute
  attributes = append(attributes, SturnAttribute{
    atrType: ATRXorMappedAddress,
    byteValue: FAMIPv4,
    intValue: int32(port),
    strValue: ip,
  });
  response := &SturnMessage{
    class: CLSResponse,
    method: MEHBinding,
    transaction: msg.transaction,
    attributes: attributes,
  };
  err, n := writeMessage(response, s.buf);
  if err != nil {
    fmt.Printf("failed to write stun response");
  } else {
    (*s.conn).WriteTo(s.buf[:n], addr);
  }
  return
}

func (s *Sturn) handleRefreshRequest(msg *SturnMessage, addr net.Addr) {

  response := &SturnMessage{
    class: CLSResponse,
    method: MEHRefresh,
    transaction: msg.transaction,
    attributes: []SturnAttribute{},
  };
  err, n := writeMessage(response, s.buf);
  if err != nil {
    fmt.Printf("failed to write stun response");
  } else {
    (*s.conn).WriteTo(s.buf[:n], addr);
  }
  return
}

func setAllocation(source string, transaction []byte, response []byte, port int, conn net.PacketConn, session *SturnSession) (*SturnAllocation) {
  allocation := &SturnAllocation{}
  allocation.port = port
  allocation.conn = conn
  allocation.source = source
  allocation.transaction = make([]byte, len(transaction))
  copy(allocation.transaction, transaction)
  allocation.response = make([]byte, len(response))
  copy(allocation.response, response)
  session.allocations[source] = allocation
  return allocation
}

func getAllocation(source string, transaction []byte, session *SturnSession) (*SturnAllocation, error) {
  for _, allocation := range session.allocations {
    if allocation.source == source {
      if len(allocation.transaction) == len(transaction) {
        match := true
        for i := 0; i < len(transaction); i++ {
          if transaction[i] != allocation.transaction[i] {
            match = false
          }
        }
        if match {
          return allocation, nil
        }
      }
      return nil, errors.New("5-tuple collision")
    }
  }
  return nil, nil
}

func (s *Sturn) handleAllocateRequest(msg *SturnMessage, addr net.Addr) {

  username := getAttribute(msg, ATRUsername)
  if username == nil {
    fmt.Println("no username", addr.String(), msg.transaction);
    s.sendRequestError(msg, addr, 401)
    return
  }

  s.sync.Lock();
  defer s.sync.Unlock();
  session, set := sturn.sessions[username.strValue]
  if !set {
    fmt.Println("no session", addr.String());
    s.sendRequestError(msg, addr, 401)
    return
  }

  allocation, collision := getAllocation(addr.String(), msg.transaction, session)
  if collision != nil {
    fmt.Println("5tuple collision", addr.String())
    s.sendRequestError(msg, addr, 403)
    return
  }
  if allocation != nil {
    fmt.Println("dup request", addr.String())
    (*s.conn).WriteTo(allocation.response, addr)
    return
  }

  relayPort, err := s.getRelayPort()
  if err != nil {
    fmt.Println(err);
    s.sendRequestError(msg, addr, 508)
    return
  }

  connAddress := fmt.Sprintf(":%d", relayPort)
  conn, connErr := net.ListenPacket("udp", connAddress)
  if connErr != nil {
    s.sendRequestError(msg, addr, 500)
    return
  }

  fmt.Println("> ", relayPort, "< ", addr.String(), msg);
  address := strings.Split(addr.String(), ":")
  ip := address[0];
  port, _ := strconv.Atoi(address[1]);
  var attributes []SturnAttribute
  attributes = append(attributes, SturnAttribute{
    atrType: ATRXorRelayedAddress,
    byteValue: FAMIPv4,
    intValue: int32(relayPort),
    //strValue: "192.168.13.233",
    strValue: "98.234.232.221",
  });
  attributes = append(attributes, SturnAttribute{
    atrType: ATRLifetime,
    intValue: int32(600),
  });
  attributes = append(attributes, SturnAttribute{
    atrType: ATRXorMappedAddress,
    byteValue: FAMIPv4,
    intValue: int32(port),
    strValue: ip,
  });
  attributes = append(attributes, SturnAttribute{
    atrType: ATRMessageIntegrity,
  });
  response := &SturnMessage{
    class: CLSResponse,
    method: MEHAllocate,
    transaction: msg.transaction,
    attributes: attributes,
  };

  err, n := writeMessage(response, s.buf)
  if err != nil {
    fmt.Printf("failed to write stun response")
  } else {
    allocation := setAllocation(addr.String(), msg.transaction, s.buf[:n], relayPort, conn, session)
    (*s.conn).WriteTo(s.buf[:n], addr)
    go s.relay(allocation);
  }
  return
}

func getAttribute(msg *SturnMessage, atrType int) (attr *SturnAttribute) {
  for i, _ := range msg.attributes {
    if msg.attributes[i].atrType == atrType {
      attr = &msg.attributes[i];
    }
  }
  return
}

func (s *Sturn) relay(allocation *SturnAllocation) {
fmt.Println("STARTED RELAY");
  for {
    buf := make([]byte, SturnMaxSize)
    n, addr, err := allocation.conn.ReadFrom(buf)
    if err != nil {
      fmt.Println(err)
      return
    }

    fmt.Println("GET REPLAY PACKET:", allocation.port, allocation.permissions, addr.String());

    s.sync.Lock();
    defer s.sync.Unlock();
    ip := strings.Split(addr.String(), ":")
    for _, permission := range allocation.permissions {
      if permission == ip[0] {
        fmt.Println("HANDLE PACKET", allocation.port, n, ip[0]);
      }
    }
  }
}

