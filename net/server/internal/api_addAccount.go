package databag

import (
  "net/http"
  "crypto/sha256"
  "encoding/hex"
  "gorm.io/gorm"
  "databag/internal/store"
)

func AddAccount(w http.ResponseWriter, r *http.Request) {

  token, res := BearerAccountToken(r);
  if res != nil || token.TokenType != "create" {
    LogMsg("authentication failed")
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  username, password, err := BasicCredentials(r);
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

  // save account and delete token
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := store.DB.Create(&account).Error; res != nil {
      return res;
    }
    if res := store.DB.Delete(token).Error; res != nil {
      return res;
    }
    return nil;
  });
  if err != nil {
    LogMsg("failed to create account");
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


