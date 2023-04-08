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
    fmt.Println(err);
    return
  }
  if msg == nil {
    return
  }

  if msg.class == CLSRequest && msg.method == MEHBinding {
    s.handleBindingRequest(msg, addr);
  } else if msg.class == CLSRequest && msg.method == MEHAllocate {
    s.handleAllocateRequest(msg, addr);
  } else {
    fmt.Println("unsupported message", buf);
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

func (s *Sturn) sendAllocateError(msg *SturnMessage, addr net.Addr) {
  var attributes []SturnAttribute
  attributes = append(attributes, SturnAttribute{
    atrType: ATRErrorCode,
    intValue: 400,
  })
  attributes = append(attributes, SturnAttribute{
    atrType: ATRNonce,
    strValue: "",
  })
  attributes = append(attributes, SturnAttribute{
    atrType: ATRRealm,
    strValue: "databag",
  })
  response := &SturnMessage{
    class: CLSError,
    method: MEHAllocate,
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

func (s *Sturn) handleAllocateRequest(msg *SturnMessage, addr net.Addr) {

  username := getAttribute(msg, ATRUsername);
  if username == nil {
    s.sendAllocateError(msg, addr);
    return;
  }

  port, err := s.getRelayPort();
  if err != nil {
    fmt.Println(err);
    s.sendAllocateError(msg, addr)
    return
  }

  fmt.Println("ALLOCATE REQUEST", msg, port);
  return
}

func getAttribute(msg *SturnMessage, atrType int) (attr *SturnAttribute) {
  for _, attribute := range msg.attributes {
    if attribute.atrType == ATRUsername {
      attr = &attribute;
    }
  }
  return
}
