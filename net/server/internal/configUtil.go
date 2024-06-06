package databag

import (
	"databag/internal/store"
	"errors"
	"gorm.io/gorm"
)

//CNFPushSupported for allowing push notifications
const CNFPushSupported = "push_notifications"

//CNFEnableOpenAccess for allowing for public account creation
const CNFEnableOpenAccess = "open_access"

//CNFOpenAccessLimit for limiting number of accounts for public creation
const CNFOpenAccessLimit = "account_limit"

//CNFConfigured set when admin token has been set
const CNFConfigured = "configured"

//CNFToken identifies the admin token
const CNFToken = "token"

//CNFDomain identifies the configured server hostname
const CNFDomain = "domain"

//CNFStorage specifies the storage limit per account
const CNFStorage = "storage"

//CNFAssetPath specifies the path to store assets
const CNFAssetPath = "asset_path"

//CNFScriptPath specifies the path where transform scripts are found
const CNFScriptPath = "script_path"

//CNFAllowUnsealed specified if plantext channels can be created
const CNFAllowUnsealed = "allow_unsealed"

//CNFEnableImage specifies whether node can process image assets
const CNFEnableImage = "enable_image"

//CNFEnableAudio specifies whether node can process audio assets
const CNFEnableAudio = "enable_audio"

//CNFEnableVideo specifies whether node can process video assets
const CNFEnableVideo = "enable_video"

//CNFEnableBinary specifies whether node can attach binary asset
const CNFEnableBinary = "enable_binary"

//CNFKeyType specifies the type of key to use for identity
const CNFKeyType = "key_type"

//CNFEnableIce specifies whether webrtc is enabled
const CNFEnableIce = "enable_ice"

//CNFIceMode specifies if turn service is used
const CNFIceService = "ice_service"

//CNFIceUrl specifies the ice candidate url
const CNFIceUrl = "ice_url"

//CNFIceUrl specifies the ice candidate username
const CNFIceUsername = "ice_username"

//CNFIceUrl specifies the ice candidate url
const CNFIcePassword = "ice_password"

//CNFMFAFailedTime start of mfa failure window
const CNFMFAFailedTime = "mfa_failed_time"

//CNFMFAFailedCount number of failures in window
const CNFMFAFailedCount = "mfa_failed_count"

//CNFMFARequired specified if mfa enabled for admin
const CNFMFAEnabled = "mfa_enabled"

//CNFMFAConfirmed specified if mfa has been confirmed for admin
const CNFMFAConfirmed = "mfa_confirmed"

//CNFMFASecret specified the mfa secret
const CNFMFASecret = "mfa_secret"

//CNFAdminSession sepcifies the admin session token
const CNFAdminSession = "admin_session"

//CNFWebPrivateKey specifies private key for webpush notifications
const CNFWebPrivateKey = "web_private_key"

//CNFWebPublicKey specifies public key for webpush notifications
const CNFWebPublicKey = "web_public_key"

func getStrConfigValue(configID string, empty string) string {
	var config store.Config
	err := store.DB.Where("config_id = ?", configID).First(&config).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return empty
	}
	return config.StrValue
}

func getNumConfigValue(configID string, empty int64) int64 {
	var config store.Config
	err := store.DB.Where("config_id = ?", configID).First(&config).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return empty
	}
	return config.NumValue
}

func getBoolConfigValue(configID string, empty bool) bool {
	var config store.Config
	err := store.DB.Where("config_id = ?", configID).First(&config).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return empty
	}
	return config.BoolValue
}

func getBinConfigValue(configID string, empty []byte) []byte {
	var config store.Config
	err := store.DB.Where("config_id = ?", configID).First(&config).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return empty
	}
	return config.BinValue
}
