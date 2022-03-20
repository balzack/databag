package databag

const APP_TOKENSIZE = 16
const APP_BODYLIMIT = 1048576
const APP_VERSION = "0.0.1"
const APP_ATTACHEXPIRE = 300
const APP_ATTACHSIZE = 4
const APP_CREATEEXPIRE = 86400
const APP_CREATESIZE = 16
const APP_RESETEXPIRE = 86400
const APP_RESETSIZE = 16
const APP_CONNECTEXPIRE = 30
const APP_KEYSIZE = 4096
const APP_RSA4096 = "RSA4096"
const APP_RSA2048 = "RSA2048"
const APP_SIGNPKCS1V15 = "PKCS1v15"
const APP_SIGNPSS = "PSS"
const APP_MSGAUTHENTICATE = "authenticate"
const APP_MSGIDENTITY = "identity"
const APP_MSGCONNECT = "connect"
const APP_MSGDISCONNECT = "disconnect"
const APP_CARDPENDING = "pending"
const APP_CARDCONFIRMED = "confirmed"
const APP_CARDREQUESTED = "requested"
const APP_CARDCONNECTING = "connecting"
const APP_CARDCONNECTED = "connected"
const APP_NOTIFYPROFILE = "profile"
const APP_NOTIFYARTICLE = "article"
const APP_NOTIFYCHANNEL = "channel"
const APP_NOTIFYVIEW = "view"
const APP_TOKENAGENT = "agent"
const APP_TOKENCONTACT = "contact"
const APP_TOKENATTACH = "attach"
const APP_TOKENCREATE = "create"
const APP_TOKENRESET = "reset"
const APP_NOTIFYBUFFER = 4096
const APP_TOPICUNCONFIRMED = "unconfirmed"
const APP_TOPICCONFIRMED = "confirmed"
const APP_ASSETREADY = "ready"
const APP_ASSETWAITING = "waiting"
const APP_ASSETPROCESSING = "processing"
const APP_ASSETERROR = "error"
const APP_TRANSFORMCOMPLETE = "complete"
const APP_TRANSFORMINCOMPLETE = "incomplete"
const APP_TRANSFORMERROR = "error"
const APP_QUEUEAUDIO = "audio"
const APP_QUEUEVIDEO = "video"
const APP_QUEUEPHOTO = "photo"
const APP_QUEUEDEFAULT = ""
const APP_DEFAULTPATH = "./asset"

func AppCardStatus(status string) bool {
  if status == APP_CARDPENDING {
    return true
  }
  if status == APP_CARDCONFIRMED {
    return true
  }
  if status == APP_CARDREQUESTED {
    return true
  }
  if status == APP_CARDCONNECTING {
    return true
  }
  if status == APP_CARDCONNECTED {
    return true
  }
  return false
}

func AppTopicStatus(status string) bool {
  if(status == APP_TOPICCONFIRMED) {
    return true
  }
  if(status == APP_TOPICUNCONFIRMED) {
    return true
  }
  return false
}
