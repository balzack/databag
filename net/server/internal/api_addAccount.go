package databag

import (
  "os"
  "net/http"
  "crypto/sha256"
  "encoding/hex"
  "gorm.io/gorm"
  "databag/internal/store"
)

func AddAccount(w http.ResponseWriter, r *http.Request) {

  token, res := BearerAccountToken(r);
  if res != nil || token.TokenType != APP_ACCOUNTCREATE {
    ErrResponse(w, http.StatusUnauthorized, res)
    return
  }

  username, password, ret := BasicCredentials(r);
  if ret != nil {
    ErrResponse(w, http.StatusUnauthorized, ret)
    return
  }

  // generate account key
  privateKey, publicKey, keyType, err := GenerateRsaKeyPair()
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  privatePem := ExportRsaPrivateKeyAsPemStr(privateKey)
  publicPem, err := ExportRsaPublicKeyAsPemStr(publicKey)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // compute key fingerprint
  msg := []byte(publicPem)
  hash := sha256.Sum256(msg)
  fingerprint := hex.EncodeToString(hash[:])

  // create path for account data
  path := getStrConfigValue(CONFIG_ASSETPATH, ".") + "/" + fingerprint
  if err := os.Mkdir(path, os.ModePerm); err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
  }

  // create new account
  account := store.Account{
    Username: username,
    Password: password,
    Guid: fingerprint,
  }
  detail := store.AccountDetail{
    PublicKey: publicPem,
    PrivateKey: privatePem,
    KeyType: keyType,
  }

  // save account and delete token
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Create(&detail).Error; res != nil {
      return res;
    }
    account.AccountDetailID = detail.ID
    if res := tx.Create(&account).Error; res != nil {
      return res;
    }
    if res := tx.Delete(token).Error; res != nil {
      return res;
    }
    return nil;
  });
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // create response
  profile := Profile{
    Guid: account.Guid,
    Handle: account.Username,
    Name: detail.Name,
    Description: detail.Description,
    Location: detail.Location,
    Image: detail.Image,
    Revision: account.ProfileRevision,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, ""),
  }

  // send response
  WriteResponse(w, profile)
}


