package sturn

const CLSUnknown = 0
const CLSRequest = 1
const CLSResponse = 2
const CLSError = 3
const CLSIndication = 4

const ATRUnknown = 0
const ATRMappedAddress = 1
const ATRUsername = 2
const ATRMessageIntegrity = 3
const ATRErrorCode = 4
const ATRUnknownAttributes = 5
const ATRRealm = 6
const ATRNonce = 7
const ATRXorMappedAddress = 8
const ATRSoftware = 9
const ATRAlternateServer = 10
const ATRFingerprint = 11
const ATRMessageIntegritySha256 = 12
const ATRPasswordAlgorithm = 13
const ATRUserHash = 14
const ATRPasswordAlgorithms = 15
const ATRAlternateDomain = 16
const ATRChannelNumber = 17
const ATRLifetime = 18
const ATRXorPeerAddress = 19
const ATRData = 20
const ATRXorRelayedAddress = 21
const ATREvenPort = 22
const ATRRequestedTransport = 23
const ATRDontFragment = 24
const ATRReservationToken = 25
const ATRAdditionalAddressFamily = 26
const ATRAddressErrorCode = 27
const ATRAddressIcmp = 28
const ATRRequestedAddressFamily = 29

const MEHUnknown = 0
const MEHBinding = 1
const MEHAllocate = 2
const MEHRefresh = 3
const MEHSend = 4
const MEHData = 5
const MEHCreatePermission = 6
const MEHChannelBind = 7

const FAMIPv4 = 1
const FAMIPv6 = 2

type SturnAttribute struct {
  atrType int
  byteValue byte
  strValue string
  intValue int32
}

type SturnMessage struct {
  class int
  method int
  transaction []byte
  attributes []SturnAttribute
}

func getMessageType(b0 byte, b1 byte) (int, int) {

  if b0 == 0x00 && b1 == 0x01 {
    return CLSRequest, MEHBinding
  }
  if b0 == 0x01 && b1 == 0x01 {
    return CLSResponse, MEHBinding
  }
  if b0 == 0x01 && b1 == 0x11 {
    return CLSError, MEHBinding
  }
  if b0 == 0x00 && b1 == 0x03 {
    return CLSRequest, MEHAllocate
  }
  if b0 == 0x01 && b1 == 0x03 {
    return CLSResponse, MEHAllocate
  }
  if b0 == 0x01 && b1 == 0x13 {
    return CLSError, MEHAllocate
  }
  if b0 == 0x00 && b1 == 0x04 {
    return CLSRequest, MEHRefresh
  }
  if b0 == 0x01 && b1 == 0x04 {
    return CLSResponse, MEHRefresh
  }
  if b0 == 0x01 && b1 == 0x14 {
    return CLSError, MEHRefresh
  }
  if b0 == 0x00 && b1 == 0x08 {
    return CLSRequest, MEHCreatePermission
  }
  if b0 == 0x01 && b1 == 0x08 {
    return CLSResponse, MEHCreatePermission
  }
  if b0 == 0x01 && b1 == 0x18 {
    return CLSError, MEHCreatePermission
  }
  if b0 == 0x00 && b1 == 0x09 {
    return CLSRequest, MEHChannelBind
  }
  if b0 == 0x01 && b1 == 0x09 {
    return CLSResponse, MEHChannelBind
  }
  if b0 == 0x01 && b1 == 0x19 {
    return CLSError, MEHChannelBind
  }
  if b0 == 0x00 && b1 == 0x16 {
    return CLSIndication, MEHSend
  }
  if b0 == 0x00 && b1 == 0x17 {
    return CLSIndication, MEHData
  }
  return CLSUnknown, MEHUnknown
}

func setMessageType(class int, method int) (byte, byte) {
  if class == CLSRequest && method == MEHBinding {
    return 0x00, 0x01
  }
  if class == CLSResponse && method == MEHBinding {
    return 0x01, 0x01
  }
  if class == CLSError && method == MEHBinding {
    return 0x01, 0x11
  }
  if class == CLSRequest && method == MEHAllocate {
    return 0x00, 0x03
  }
  if class == CLSResponse && method == MEHAllocate {
    return 0x01, 0x03
  }
  if class == CLSError && method == MEHAllocate {
    return 0x01, 0x13
  }
  if class == CLSResponse && method == MEHCreatePermission {
    return 0x01, 0x08
  }
  if class == CLSError && method == MEHCreatePermission {
    return 0x01, 0x18
  }
  return 0x00, 0x00
}

func getAttributeType(b0 byte, b1 byte) (int) {
  if b1 == 0x01 && b0 == 0x00 {
    return ATRMappedAddress
  }
  if b1 == 0x06 && b0 == 0x00 {
    return ATRUsername
  }
  if b1 == 0x08 && b0 == 0x00 {
    return ATRMessageIntegrity
  }
  if b1 == 0x09 && b0 == 0x00 {
    return ATRErrorCode
  }
  if b1 == 0x0A && b0 == 0x00 {
    return ATRUnknownAttributes
  }
  if b1 == 0x14 && b0 == 0x00 {
    return ATRRealm
  }
  if b1 == 0x15 && b0 == 0x00 {
    return ATRNonce
  }
  if b1 == 0x20 && b0 == 0x00 {
    return ATRXorMappedAddress
  }
  if b1 == 0x22 && b0 == 0x80 {
    return ATRSoftware
  }
  if b1 == 0x23 && b0 == 0x80 {
    return ATRAlternateServer
  }
  if b1 == 0x28 && b0 == 0x80 {
    return ATRFingerprint
  }
  if b1 == 0x1C && b0 == 0x00 {
    return ATRMessageIntegritySha256
  }
  if b1 == 0x1D && b0 == 0x00 {
    return ATRPasswordAlgorithms
  }
  if b1 == 0x1E && b0 == 0x00 {
    return ATRUserHash
  }
  if b1 == 0x02 && b0 == 0x80 {
    return ATRPasswordAlgorithms
  }
  if b1 == 0x03 && b0 == 0x80 {
    return ATRAlternateDomain
  }
  if b1 == 0x0C && b0 == 0x00 {
    return ATRChannelNumber
  }
  if b1 == 0x0D && b0 == 0x00 {
    return ATRLifetime
  }
  if b1 == 0x12 && b0 == 0x00 {
    return ATRXorPeerAddress
  }
  if b1 == 0x13 && b0 == 0x00 {
    return ATRData
  }
  if b1 == 0x16 && b0 == 0x00 {
    return ATRXorRelayedAddress
  }
  if b1 == 0x17 && b0 == 0x00 {
    return ATRRequestedAddressFamily
  }
  if b1 == 0x18 && b0 == 0x00 {
    return ATREvenPort
  }
  if b1 == 0x19 && b0 == 0x00 {
    return ATRRequestedTransport
  }
  if b1 == 0x1A && b0 == 0x00 {
    return ATRDontFragment
  }
  if b1 == 0x22 && b0 == 0x00 {
    return ATRReservationToken
  }
  if b1 == 0x00 && b0 == 0x80 {
    return ATRAdditionalAddressFamily
  }
  if b1 == 0x01 && b0 == 0x80 {
    return ATRAddressErrorCode
  }
  if b1 == 0x04 && b0 == 0x80 {
    return ATRAddressIcmp
  }
  return ATRUnknown
}

func setAttributeType(atrType int) (byte, byte) {
  if atrType == ATRMappedAddress {
    return 0x01, 0x00
  }
  if atrType == ATRUsername {
    return 0x06, 0x00
  }
  if atrType == ATRMessageIntegrity {
    return 0x08, 0x00
  }
  if atrType == ATRErrorCode {
    return 0x09, 0x00
  }
  if atrType == ATRUnknownAttributes {
    return 0x0A, 0x00
  }
  if atrType == ATRRealm {
    return 0x14, 0x00
  }
  if atrType == ATRNonce {
    return 0x15, 0x00
  }
  if atrType == ATRXorMappedAddress {
    return 0x20, 0x00
  }
  if atrType == ATRSoftware {
    return 0x22, 0x80
  }
  if atrType == ATRAlternateServer {
    return 0x23, 0x80
  }
  if atrType == ATRFingerprint {
    return 0x28, 0x80
  }
  if atrType == ATRMessageIntegritySha256 {
    return 0x1C, 0x00
  }
  if atrType == ATRPasswordAlgorithms {
    return 0x1D, 0x00
  }
  if atrType == ATRUserHash {
    return 0x1E, 0x00
  }
  if atrType == ATRPasswordAlgorithms {
    return 0x02, 0x80
  }
  if atrType == ATRAlternateDomain {
    return 0x03, 0x80
  }
  if atrType == ATRChannelNumber {
    return 0x0C, 0x00
  }
  if atrType == ATRLifetime {
    return 0x0D, 0x00
  }
  if atrType == ATRXorPeerAddress {
    return 0x12, 0x00
  }
  if atrType == ATRData {
    return 0x13, 0x00
  }
  if atrType == ATRXorRelayedAddress {
    return 0x16, 0x00
  }
  if atrType == ATRRequestedAddressFamily {
    return 0x17, 0x00
  }
  if atrType == ATREvenPort {
    return 0x18, 0x00
  }
  if atrType == ATRRequestedTransport {
    return 0x19, 0x00
  }
  if atrType == ATRDontFragment {
    return 0x1A, 0x00
  }
  if atrType == ATRReservationToken {
    return 0x22, 0x00
  }
  if atrType == ATRAdditionalAddressFamily {
    return 0x00, 0x80
  }
  if atrType == ATRAddressErrorCode {
    return 0x01, 0x80
  }
  if atrType == ATRAddressIcmp {
    return 0x04, 0x80
  }
  return 0x00, 0x00
}
