package databag

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
)

var keySize int = APPKeySize

//SetKeySize sets the key size to use for new accounts
func SetKeySize(size int) {
	keySize = size
}

//GenerateRsaKeyPair creates a public/private key for a new account
func GenerateRsaKeyPair() (*rsa.PrivateKey, *rsa.PublicKey, string, error) {
	if keySize == 2048 {
		privkey, _ := rsa.GenerateKey(rand.Reader, keySize)
		return privkey, &privkey.PublicKey, "RSA2048", nil
	} else if keySize == 4096 {
		privkey, _ := rsa.GenerateKey(rand.Reader, keySize)
		return privkey, &privkey.PublicKey, "RSA2048", nil
	} else {
		return nil, nil, "", errors.New("invalid key setting")
	}
}

//ExportRsaPrivateKeyAsPemStr exports account private key
func ExportRsaPrivateKeyAsPemStr(privkey *rsa.PrivateKey) string {
	privkeyBytes := x509.MarshalPKCS1PrivateKey(privkey)
	privkeyPEM := pem.EncodeToMemory(
		&pem.Block{
			Type:  "RSA PRIVATE KEY",
			Bytes: privkeyBytes,
		},
	)
	return string(privkeyPEM)
}

//ParseRsaPrivateKeyFromPemStr loads account private key
func ParseRsaPrivateKeyFromPemStr(privPEM string) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(privPEM))
	if block == nil {
		return nil, errors.New("failed to parse PEM block containing the key")
	}

	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	return priv, nil
}

//ExportRsaPublicKeyAsPemStr exports account public key
func ExportRsaPublicKeyAsPemStr(pubkey *rsa.PublicKey) (string, error) {
	pubkeyBytes, err := x509.MarshalPKIXPublicKey(pubkey)
	if err != nil {
		return "", err
	}
	pubkeyPEM := pem.EncodeToMemory(
		&pem.Block{
			Type:  "RSA PUBLIC KEY",
			Bytes: pubkeyBytes,
		},
	)

	return string(pubkeyPEM), nil
}

//ParseRsaPublicKeyFromPemStr loads account public key
func ParseRsaPublicKeyFromPemStr(pubPEM string) (*rsa.PublicKey, error) {
	block, _ := pem.Decode([]byte(pubPEM))
	if block == nil {
		return nil, errors.New("failed to parse PEM block containing the key")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	switch pub := pub.(type) {
	case *rsa.PublicKey:
		return pub, nil
	default:
		break // fall through
	}
	return nil, errors.New("Key type is not RSA")
}
