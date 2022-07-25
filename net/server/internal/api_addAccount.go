package databag

import (
	"crypto/sha256"
	"databag/internal/store"
	"encoding/hex"
	"errors"
	"gorm.io/gorm"
	"net/http"
	"os"
	"strings"
)

//AddAccount if available, create account with specified username and password
func AddAccount(w http.ResponseWriter, r *http.Request) {
	var token *store.AccountToken
	var res error

	if r.FormValue("token") != "" {
		token, _, res = AccessToken(r)
		if res != nil || token.TokenType != APPTokenCreate {
			ErrResponse(w, http.StatusUnauthorized, res)
			return
		}
	} else {
		if available, err := getAvailableAccounts(); err != nil {
			ErrResponse(w, http.StatusInternalServerError, err)
			return
		} else if available == 0 {
			ErrResponse(w, http.StatusForbidden, errors.New("no open accounts available"))
			return
		}
	}

	username, password, ret := BasicCredentials(r)
	if ret != nil {
		ErrResponse(w, http.StatusUnauthorized, ret)
		return
	}

	if strings.Contains(username, " ") || strings.Contains(username, "\t") {
		ErrResponse(w, http.StatusConflict, errors.New("username has whitespace"))
		return
	}

	// check if username is taken
	var count int64
	if err := store.DB.Model(&store.Account{}).Where("username = ?", username).Count(&count).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}
	if count != 0 {
		ErrResponse(w, http.StatusConflict, errors.New("username already taken"))
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
	path := getStrConfigValue(CNFAssetPath, APPDefaultPath) + "/" + fingerprint
	if err := os.Mkdir(path, os.ModePerm); err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
	}

	// create new account
	account := store.Account{
		Username: username,
		Handle:   strings.ToLower(username),
		Password: password,
		GUID:     fingerprint,
	}
	detail := store.AccountDetail{
		PublicKey:  publicPem,
		PrivateKey: privatePem,
		KeyType:    keyType,
	}

	// save account and delete token
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Create(&detail).Error; res != nil {
			return res
		}
		account.AccountDetailID = detail.ID
		if res := tx.Create(&account).Error; res != nil {
			return res
		}
		if token != nil {
			if res := tx.Delete(token).Error; res != nil {
				return res
			}
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	// create response
	profile := Profile{
		GUID:        account.GUID,
		Handle:      account.Username,
		Name:        detail.Name,
		Description: detail.Description,
		Location:    detail.Location,
		Image:       detail.Image,
		Revision:    account.ProfileRevision,
		Version:     APPVersion,
		Node:        getStrConfigValue(CNFDomain, ""),
	}

	// send response
	WriteResponse(w, profile)
}
