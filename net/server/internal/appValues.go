package databag

const APPTokenSize = 16
const APPBodyLimit = 1048576
const APPVersion = "0.0.1"
const APPAttachExpire = 300
const APPAttachSize = 4
const APPCreateExpire = 86400
const APPCreateSize = 16
const APPResetExpire = 86400
const APPResetSize = 16
const APPConnectExpire = 30
const APPKeySize = 4096
const APPRSA4096 = "RSA4096"
const APPRSA2048 = "RSA2048"
const APPSignPKCS1V15 = "PKCS1v15"
const APPSignPSS = "PSS"
const APPMsgAuthenticate = "authenticate"
const APPMsgIdentity = "identity"
const APPMsgConnect = "connect"
const APPMsgDisconnect = "disconnect"
const APPCardPending = "pending"
const APPCardConfirmed = "confirmed"
const APPCardRequested = "requested"
const APPCardConnecting = "connecting"
const APPCardConnected = "connected"
const APPNotifyProfile = "profile"
const APPNotifyArticle = "article"
const APPNotifyChannel = "channel"
const APPNotifyView = "view"
const APPTokenAgent = "agent"
const APPTokenContact = "contact"
const APPTokenAttach = "attach"
const APPTokenCreate = "create"
const APPTokenReset = "reset"
const APPNotifyBuffer = 4096
const AppTopicUnconfirmed = "unconfirmed"
const APPTopicConfirmed = "confirmed"
const APPAssetReady = "ready"
const APPAssetWaiting = "waiting"
const APPAssetProcessing = "processing"
const APPAssetError = "error"
const APPTransformComplete = "complete"
const APPTransformIncomplete = "incomplete"
const APPTransformError = "error"
const APPQueueAudio = "audio"
const APPQueueVideo = "video"
const APPQueuePhoto = "photo"
const APPQueueDefault = ""
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
  if(status == APPTopicConfirmed) {
    return true
  }
  if(status == AppTopicUnconfirmed) {
    return true
  }
  return false
}
