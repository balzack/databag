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
    fmt.Println(err, addr.String(), buf);
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
    s.handleSendIndication(msg, addr, buf);
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
  _, set := sturn.sessions[username.strValue]
  if !set {
    fmt.Println("no session", addr.String());
    s.sendRequestError(msg, addr, 401)
    return
  }

  source := addr.String()
  allocation, found := s.allocations[source]
  if !found {
    fmt.Println("no allocation");
    s.sendRequestError(msg, addr, 400)
    return
  }

  allocation.permissions = append(allocation.permissions, permission.strValue);

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

func (s *Sturn) handleSendIndication(msg *SturnMessage, addr net.Addr, buf []byte) {

  peer := getAttribute(msg, ATRXorPeerAddress)
  if peer == nil {
    fmt.Println("no peer");
    return
  }

  data := getAttribute(msg, ATRData)
  if data == nil {
    fmt.Println("no data");
    return
  }

  s.sync.Lock();
  defer s.sync.Unlock();
  source := addr.String()
  allocation, found := s.allocations[source]
  if !found {
    fmt.Println("no allocation");
    return
  }

  set := false
  for _, permission := range allocation.permissions {
    if permission == peer.strValue {
      address := fmt.Sprintf("%s:%d", peer.strValue, peer.intValue)
      dst, err := net.ResolveUDPAddr("udp", address)
      if err != nil {
        fmt.Println("no resolve");
        return
      }

      set = true
      fmt.Println("stun/turn data", dst.String());
      _, err = allocation.conn.WriteTo(data.binValue, dst)
      if err != nil {
        fmt.Println("write error");
      }
    }
  }
  if !set {
    fmt.Println("dropped indication");
  }
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

func (s *Sturn) setAllocation(addr net.Addr, transaction []byte, response []byte, port int, conn net.PacketConn, session *SturnSession) (*SturnAllocation) {
  source := addr.String()
  allocation := &SturnAllocation{}
  allocation.port = port
  allocation.conn = conn
  allocation.source = source
  allocation.addr = addr
  allocation.transaction = make([]byte, len(transaction))
  copy(allocation.transaction, transaction)
  allocation.response = make([]byte, len(response))
  copy(allocation.response, response)
  s.allocations[source] = allocation
  return allocation
}

func (s *Sturn) getAllocation(source string, transaction []byte, session *SturnSession) (*SturnAllocation, error) {
  for _, allocation := range s.allocations {
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

  allocation, collision := s.getAllocation(addr.String(), msg.transaction, session)
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
    allocation := s.setAllocation(addr, msg.transaction, s.buf[:n], relayPort, conn, session)
    (*s.conn).WriteTo(s.buf[:n], addr)
    fmt.Println("allocated: ", addr.String())
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
  data := make([]byte, SturnMaxSize)
  buf := make([]byte, SturnMaxSize)
  for {
    n, addr, err := allocation.conn.ReadFrom(data)
    if err != nil {
      fmt.Println(err)
      // CLEANUP ALLOCATION
      return
    }

    s.sync.Lock();
    split := strings.Split(addr.String(), ":")
    ip := split[0]
    port, _ := strconv.Atoi(split[1]);
    set := false
    for _, permission := range allocation.permissions {
      if permission == ip {

        var attributes []SturnAttribute
        attributes = append(attributes, SturnAttribute{
          atrType: ATRXorPeerAddress,
          strValue: ip,
          intValue: int32(port),
        })
        attributes = append(attributes, SturnAttribute{
          atrType: ATRData,
          binValue: data[:n],
        })

        relay := &SturnMessage{
          class: CLSIndication,
          method: MEHData,
          transaction: []byte{ 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22 },
          attributes: attributes,
        };

        err, l := writeMessage(relay, buf)
        if err != nil {
          fmt.Println("no resolve");
        } else {
          fmt.Println("---- stun/turn relay", allocation.addr.String());
          _, err := allocation.conn.WriteTo(buf[:l], allocation.addr);
          set = true
          if err != nil {
            fmt.Println("writeto failed");
          }
        }
      }
    }
    if !set {
      fmt.Println("dropped relay");
    }
    s.sync.Unlock();
  }
}

