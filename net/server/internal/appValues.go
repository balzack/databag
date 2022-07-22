package databag

//APPTokenSize config for size of random access token
const APPTokenSize = 16

//APPBodyLimit config for max size of api body
const APPBodyLimit = 1048576

//APPVersion config for current version of api
const APPVersion = "0.0.1"

//APPCreateExpire config for valid duration of create token
const APPCreateExpire = 86400

//APPCreateSize config for size of create token
const APPCreateSize = 16

//APPResetExpire config for valid duration of reset token
const APPResetExpire = 86400

//APPResetSize config for size of reset token
const APPResetSize = 16

//APPConnectExpire config for valid duration of connection message
const APPConnectExpire = 30

//APPKeySize config for default key size
const APPKeySize = 4096

//APPRSA4096 config for rsa 4096 alg name
const APPRSA4096 = "RSA4096"

//APPRSA2048 config for rsa 2048 alg name
const APPRSA2048 = "RSA2048"

//APPSignPKCS1V15 config for pkcsv15 alg name
const APPSignPKCS1V15 = "PKCS1v15"

//APPSignPSS config for pss alg name
const APPSignPSS = "PSS"

//APPMsgAuthenticate config for authorize message name
const APPMsgAuthenticate = "authenticate"

//APPMsgIdentity config for identity message name
const APPMsgIdentity = "identity"

//APPMsgConnect config for connect message name
const APPMsgConnect = "connect"

//APPMsgDisconnect config for disconnect message name
const APPMsgDisconnect = "disconnect"

//APPCardPending config for pending status name
const APPCardPending = "pending"

//APPCardConfirmed config for confirmed status name
const APPCardConfirmed = "confirmed"

//APPCardRequested config for requested status name
const APPCardRequested = "requested"

//APPCardConnecting config for connecting status name
const APPCardConnecting = "connecting"

//APPCardConnected config for connected status name
const APPCardConnected = "connected"

//APPNotifyProfile config for notification name for profile
const APPNotifyProfile = "profile"

//APPNotifyArticle config for notification name for article
const APPNotifyArticle = "article"

//APPNotifyChannel config for notification name for channel
const APPNotifyChannel = "channel"

//APPNotifyView config for notification name for view
const APPNotifyView = "view"

//APPTokenAgent config for query param name for self token
const APPTokenAgent = "agent"

//APPTokenContact config for query param name for contact token
const APPTokenContact = "contact"

//APPTokenAttach config for query param name for attach token
const APPTokenAttach = "attach"

//APPTokenCreate config for query param name for create token
const APPTokenCreate = "create"

//APPTokenReset config for query param name for reset token
const APPTokenReset = "reset"

//APPNotifyBuffer config for size of channel reciving notifications
const APPNotifyBuffer = 4096

//APPTopicUnconfirmed config for status name for unconfirmed
const APPTopicUnconfirmed = "unconfirmed"

//APPTopicConfirmed config for status name for confirmed
const APPTopicConfirmed = "confirmed"

//APPAssetReady config for status name for ready
const APPAssetReady = "ready"

//APPAssetWaiting config for status name for waiting
const APPAssetWaiting = "waiting"

//APPAssetProcessing config for status name for processing
const APPAssetProcessing = "processing"

//APPAssetError config for status name for error
const APPAssetError = "error"

//APPTransformComplete config for status name for completed processing
const APPTransformComplete = "complete"

//APPTransformIncomplete config for status name for not complete processing
const APPTransformIncomplete = "incomplete"

//APPTransformError config for status name for processing error
const APPTransformError = "error"

//APPQueueAudio config for queue name for audio assets
const APPQueueAudio = "audio"

//APPQueueVideo config for queue name for video assets
const APPQueueVideo = "video"

//APPQueuePhoto config for queue name for photo assets
const APPQueuePhoto = "photo"

//APPQueueDefault config for queue name for other assets
const APPQueueDefault = ""

//APPDefaultPath config for default path to store assets
const APPDefaultPath = "./asset"

func AppCardStatus(status string) bool {
	if status == APPCardPending {
		return true
	}
	if status == APPCardConfirmed {
		return true
	}
	if status == APPCardRequested {
		return true
	}
	if status == APPCardConnecting {
		return true
	}
	if status == APPCardConnected {
		return true
	}
	return false
}

func AppTopicStatus(status string) bool {
	if status == APPTopicConfirmed {
		return true
	}
	if status == APPTopicUnconfirmed {
		return true
	}
	return false
}
