package sturn

import (
  "errors"
  "strings"
  "strconv"
  "fmt"
)

func readAttribute(buf []byte, pos int) (error, *SturnAttribute, int) {

  if len(buf) - pos < 4 {
    return errors.New("invalid attribute length"), nil, 0
  }
  atrType := getAttributeType(buf[pos + 0], buf[pos + 1])
  atrLength := int(buf[pos + 2]) * 256 + int(buf[pos + 3])
  padLength := ((atrLength + 3) >> 2) << 2
  if len(buf) - pos < 4 + padLength {
    return errors.New("invalid attribute buffer"), nil, 0
  }

  var intValue int32
  var strValue string
  if atrType == ATRRequestedTransport {
    if buf[pos + 5] != 0x00 || buf[pos + 6] != 0x00 || buf[pos + 7] != 0x00 {
      return errors.New("invalid attribute"), nil, 0
    }
    intValue = int32(buf[pos + 4])
  } else if atrType == ATRLifetime {
    intValue = 256 * (256 * (256 * int32(buf[pos + 4]) + int32(buf[pos + 5])) + int32(buf[pos + 6])) + int32(buf[pos + 7]);
  } else if atrType == ATRNonce {
    strValue = string(buf[pos + 4:pos + 4+atrLength]);
  } else if atrType == ATRUsername {
    strValue = string(buf[pos + 4:pos + 4+atrLength]);
  } else if atrType == ATRRealm {
    strValue = string(buf[pos + 4:pos + 4+atrLength]);
  } else if atrType == ATRMessageIntegrity {
    fmt.Println("HANDLE: ATRMessageIntegrity");
  } else if atrType == ATRMessageIntegritySha256 {
    fmt.Println("HANDLE: ATRMessageIntegritySha256");
  } else if atrType == ATRFingerprint {
    fmt.Println("HANDLE: ATRFingerprint");
  } else {
    fmt.Println("UNKNOWN ATTRIBUTE");
  }

  return nil, &SturnAttribute{
    atrType: atrType,
    intValue: intValue,
    strValue: strValue,
  }, 4 + padLength;

  return nil, nil, 0
}

func writeAttribute(attribute *SturnAttribute, buf []byte, pos int) (error, int) {

  if len(buf) - pos < 4 {
    return errors.New("invalid buffer size"), 0
  }

  if attribute.atrType == ATRXorMappedAddress {
    if len(buf) - pos < 12 {
      return errors.New("invalid buffer size"), 0
    }
    ip := 0
    parts := strings.Split(attribute.strValue, ".");
    for i := 0; i < 4; i++ {
      val, _ := strconv.Atoi(parts[i]);
      ip = (ip * 256) + val;
    }
    buf[pos + 1], buf[pos + 0] = setAttributeType(ATRXorMappedAddress);
    buf[pos + 2] = 0x00
    buf[pos + 3] = 0x08
    buf[pos + 4] = 0x00
    buf[pos + 5] = FAMIPv4
    buf[pos + 6] = byte((attribute.intValue >> 8) % 256) ^ 0x21
    buf[pos + 7] = byte((attribute.intValue) % 256) ^ 0x12
    buf[pos + 8] = byte((ip >> 24) % 256) ^ 0x21
    buf[pos + 9] = byte((ip >> 16) % 256) ^ 0x12
    buf[pos + 10] = byte((ip >> 8) % 256) ^ 0xA4
    buf[pos + 11] = byte(ip % 256) ^ 0x42
    return nil, 12
  } else if attribute.atrType == ATRXorRelayedAddress {
    if len(buf) - pos < 12 {
      return errors.New("invalid buffer size"), 0
    }
    ip := 0
    parts := strings.Split(attribute.strValue, ".");
    for i := 0; i < 4; i++ {
      val, _ := strconv.Atoi(parts[i]);
      ip = (ip * 256) + val;
    }
    buf[pos + 1], buf[pos + 0] = setAttributeType(ATRXorRelayedAddress);
    buf[pos + 2] = 0x00
    buf[pos + 3] = 0x08
    buf[pos + 4] = 0x00
    buf[pos + 5] = FAMIPv4
    buf[pos + 6] = byte((attribute.intValue >> 8) % 256) ^ 0x21
    buf[pos + 7] = byte(attribute.intValue % 256) ^ 0x12
    buf[pos + 8] = byte((ip >> 24) % 256) ^ 0x21
    buf[pos + 9] = byte((ip >> 16) % 256) ^ 0x12
    buf[pos + 10] = byte((ip >> 8) % 256) ^ 0xA4
    buf[pos + 11] = byte(ip % 256) ^ 0x42
    return nil, 12
  } else if attribute.atrType == ATRLifetime {
    if len(buf) - pos < 8 {
      return errors.New("invalid buffer size"), 0
    }
    buf[pos + 1], buf[pos + 0] = setAttributeType(ATRLifetime);
    buf[pos + 2] = 0x00
    buf[pos + 3] = 0x04
    buf[pos + 4] = byte((attribute.intValue >> 24) % 256);
    buf[pos + 5] = byte((attribute.intValue >> 16) % 256);
    buf[pos + 6] = byte((attribute.intValue >> 8) % 256);
    buf[pos + 7] = byte(attribute.intValue % 256);
    return nil, 8
  } else if attribute.atrType == ATRNonce {
    raw := []byte(attribute.strValue)
    rawLen := len(raw);
    paddedLen := ((len(raw) + 3) >> 2) << 2
    if paddedLen >= 256 {
      return errors.New("invalid attribute size"), 0
    }
    if len(buf) - pos < 4 + paddedLen {
      return errors.New("invalid buffer size"), 0
    }
    buf[pos + 1], buf[pos + 0] = setAttributeType(ATRNonce);
    buf[pos + 2] = 0x00
    buf[pos + 3] = byte(rawLen)
    for i := 0; i < len(raw); i++ {
      buf[pos + 4 + i] = raw[i];
    }
    for i := len(raw); i < paddedLen; i++ {
      buf[pos + 4 + i] = 0x00;
    }
    return nil, 4 + paddedLen
  } else if attribute.atrType == ATRRealm {
    raw := []byte(attribute.strValue)
    rawLen := len(raw);
    paddedLen := ((len(raw) + 3) >> 2) << 2
    if paddedLen >= 256 {
      return errors.New("invalid attribute size"), 0
    }
    if len(buf) - pos < 4 + paddedLen {
      return errors.New("invalid buffer size"), 0
    }
    buf[pos + 1], buf[pos + 0] = setAttributeType(ATRRealm);
    buf[pos + 2] = 0x00
    buf[pos + 3] = byte(rawLen);
    for i := 0; i < len(raw); i++ {
      buf[pos + 4 + i] = raw[i];
    }
    for i := len(raw); i < paddedLen; i++ {
      buf[pos + 4 + i] = 0x00;
    }
    return nil, 4 + paddedLen
  } else if attribute.atrType == ATRErrorCode {
    if len(buf) - pos < 8 {
      return errors.New("invalid buffer size"), 0
    }
    buf[pos + 1], buf[pos + 0] = setAttributeType(ATRErrorCode);
    buf[pos + 2] = 0x00
    buf[pos + 3] = 0x04
    buf[pos + 4] = 0x00
    buf[pos + 5] = 0x00
    buf[pos + 6] = 0x04
    buf[pos + 7] = 0x01
    return nil, 8
  } else {
    fmt.Println("UNKNOWN!");
  }
  return nil, 8
}
