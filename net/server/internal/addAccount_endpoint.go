package databag

import (
  "net/http"
  "crypto/sha256"
  "encoding/hex"
  "databag/internal/store"
)

func AddAccount(w http.ResponseWriter, r *http.Request) {

  if _, err := bearerAccountToken(r); err != nil {
    LogMsg("authentication failed")
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  username, password, err := basicCredentials(r);
  if err != nil {
    LogMsg("invalid basic credentials")
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  // generate account key
  privateKey, publicKey := GenerateRsaKeyPair()
  privatePem := ExportRsaPrivateKeyAsPemStr(privateKey)
  publicPem, err := ExportRsaPublicKeyAsPemStr(publicKey)
  if err != nil {
    LogMsg("failed generate key")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  // compute key fingerprint
  msg := []byte(publicPem)
  hash := sha256.New()
  if _, err = hash.Write(msg); err != nil {
    LogMsg("failed to fingerprint key")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  fingerprint := hex.EncodeToString(hash.Sum(nil))

  // create new account
  account := store.Account{
    PublicKey: publicPem,
    PrivateKey: privatePem,
    KeyType: "RSA4096",
    Username: username,
    Password: password,
    Guid: fingerprint,
  };
  if res := store.DB.Create(&account).Error; res != nil {
    LogMsg("failed to store account")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  // create response
  profile := Profile{
    Guid: account.Guid,
    Handle: account.Username,
    Name: account.Name,
    Description: account.Description,
    Location: account.Location,
    Image: account.Image,
    Revision: account.ProfileRevision,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, ""),
  }

  // send response
  WriteResponse(w, profile)
}


