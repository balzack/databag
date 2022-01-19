package databag

import (
  "crypto"
  "crypto/rand"
  "crypto/sha256"
  "crypto/rsa"
	"net/http"
  "encoding/json"
  "encoding/base64"
  "time"
)

func Authorize(w http.ResponseWriter, r *http.Request) {

  account, res := BearerAppToken(r, true);
  if res != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  if account.Disabled {
    w.WriteHeader(http.StatusGone);
    return
  }

  // extract token from body
  var token string
  err := ParseRequest(r, w, &token)
  if err != nil {
    w.WriteHeader(http.StatusBadRequest);
    return
  }

  // load details to sign data
  if account.AccountDetail.KeyType != "RSA4096" {
    w.WriteHeader(http.StatusServiceUnavailable)
    return
  }
  privateKey, res := ParseRsaPrivateKeyFromPemStr(account.AccountDetail.PrivateKey);
  if  res != nil {
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  // generate message
  auth := Authenticate{
    Guid: account.Guid,
    Token: token,
    Timestamp: time.Now().Unix(),
  }
  var data []byte
  data, err = json.Marshal(auth);
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  hash := sha256.Sum256(data);
  var signature []byte
  signature, err = rsa.SignPKCS1v15(rand.Reader, privateKey, crypto.SHA256, hash[:])
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  msg := DataMessage{
    MessageType: "authenticate",
    Message: base64.StdEncoding.EncodeToString([]byte(data)),
    KeyType: account.AccountDetail.KeyType,
    PublicKey: base64.StdEncoding.EncodeToString([]byte(account.AccountDetail.PublicKey)),
    Signature: base64.StdEncoding.EncodeToString(signature),
    SignatureType: "PKCS1v15",
  }

  WriteResponse(w, msg)
}
