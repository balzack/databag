package databag

//AccountProfile account profile view retrieved by admin
type AccountProfile struct {
	AccountID uint32 `json:"accountId"`

	GUID string `json:"guid"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	ImageSet bool `json:"imageSet,omitempty"`

  Seal string `json:"seal,emitempty"`

	Disabled bool `json:"disabled"`
}

//AccountStatus server settings for account
type AccountStatus struct {
	Disabled bool `json:"disabled"`

	StorageUsed int64 `json:"storageUsed"`

	StorageAvailable int64 `json:"storageAvailable"`

	ForwardingAddress string `json:"forwardingAddress"`

	Searchable bool `json:"searchable"`

	PushEnabled bool `json:"pushEnabled"`

  Sealable bool `json:"sealable"`

	Seal *Seal `json:"seal,omitempty"`
}

//Announce initial message sent on websocket
type Announce struct {
	AppToken string `json:"appToken"`
}

//Notification describes type of notifications to receive
type Notification struct {
	Event string `json:"event,omitempty"`

	MessageTitle string `json:"messageTitle,omitempty"`

	MessageBody string `json:"messageBoday,omitempty"`
}

//Article slot for account data shared by group list
type Article struct {
	ID string `json:"id"`

	Revision int64 `json:"revision"`

	Data *ArticleData `json:"data"`
}

//ArticleData account data shared by group list
type ArticleData struct {
	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`

	Groups *IDList `json:"groups,omitempty"`
}

//Asset files associated with channel topic
type Asset struct {
	AssetID string `json:"assetId"`

	Transform string `json:"transform,omitempty"`

	Status string `json:"status,omitempty"`
}

//Card slot for references to an account contact
type Card struct {
	ID string `json:"id"`

	Revision int64 `json:"revision"`

	Data *CardData `json:"data"`
}

//CardData account contact data
type CardData struct {
	DetailRevision int64 `json:"detailRevision"`

	ProfileRevision int64 `json:"profileRevision"`

	NotifiedProfile int64 `json:"notifiedProfile"`

	NotifiedArticle int64 `json:"notifiedArticle"`

	NotifiedChannel int64 `json:"notifiedChannel"`

	NotifiedView int64 `json:"notifiedView"`

	CardDetail *CardDetail `json:"cardDetail,omitempty"`

	CardProfile *CardProfile `json:"cardProfile,omitempty"`
}

//CardDetail values set for associated contact
type CardDetail struct {
	Status string `json:"status"`

	StatusUpdated int64 `json:"statusUpdated"`

  Token string `json:"token,omitempty"`

	Notes string `json:"notes,omitempty"`

	Groups []string `json:"groups,omitempty"`
}

//CardProfile profile for account contact
type CardProfile struct {
	GUID string `json:"guid"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	ImageSet bool `json:"imageSet"`

  Seal string `json:"seal,omitempty"`

	Version string `json:"version,omitempty"`

	Node string `json:"node"`
}

//ChannelContacts ids for cards and groups with whom channel is shared
type ChannelContacts struct {
	Groups []string `json:"groups"`

	Cards []string `json:"cards"`
}

//Channel slot for communication channel
type Channel struct {
	ID string `json:"id"`

	Revision int64 `json:"revision"`

	Data *ChannelData `json:"data"`
}

//ChannelData communication channel data
type ChannelData struct {
	DetailRevision int64 `json:"detailRevision"`

	TopicRevision int64 `json:"topicRevision"`

	ChannelSummary *ChannelSummary `json:"channelSummary,omitempty"`

	ChannelDetail *ChannelDetail `json:"channelDetail,omitempty"`
}

//ChannelDetail description of channel
type ChannelDetail struct {
	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`

  EnableImage bool `json:"enableImage"`

  EnableAudio bool `json:"enableAudio"`

  EnableVideo bool `json:"enableVideo"`

	Contacts *ChannelContacts `json:"contacts,omitempty"`

	Members []string `json:"members"`
}

//ChannelMember contact member of channel
type ChannelMember struct {
  Member string `json:"member"`

  PushEnabled bool `json:"pushEnabled"`
}

//ChannelSummary latest topic posted on channel
type ChannelSummary struct {
	LastTopic *TopicDetail `json:"lastTopic,omitempty"`
}

//ChannelParams params used when creating a channel
type ChannelParams struct {
	DataType string `json:"dataType"`

	Data string `json:"data"`

	Groups []string `json:"groups"`

	Cards []string `json:"cards"`
}

//Claim token to verify for 3rd party authentication
type Claim struct {
	Token string `json:"token"`
}

//Connect data exchanged in a contact connection message
type Connect struct {
	Contact string `json:"contact"`

	Token string `json:"token"`

	ViewRevision int64 `json:"viewRevision,omitempty"`

	ArticleRevision int64 `json:"articleRevision,omitempty"`

	ProfileRevision int64 `json:"profileRevision,omitempty"`

	ChannelRevision int64 `json:"channelRevision,omitempty"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	Image string `json:"image,omitempty"`

	Version string `json:"version,omitempty"`

	Node string `json:"node,omitempty"`
}

//ContactStatus status of contact returned after connection message
type ContactStatus struct {
	Token string `json:"token,omitempty"`

	ProfileRevision int64 `json:"profileRevision,omitempty"`

	ArticleRevision int64 `json:"articleRevision,omitempty"`

	ChannelRevision int64 `json:"channelRevision,omitempty"`

	ViewRevision int64 `json:"viewRevision,omitempty"`

	Status string `json:"status"`
}

//DataMessage general structure holding signed messages
type DataMessage struct {
	Message string `json:"message"`

	KeyType string `json:"keyType"`

	PublicKey string `json:"publicKey"`

	Signature string `json:"signature"`

	SignatureType string `json:"signatureType"`
}

//Disconnect data exchanged when closing connection
type Disconnect struct {
	Contact string `json:"contact"`
}

//Group slot for holding a contact group alias
type Group struct {
	ID string `json:"id"`

	Revision int64 `json:"revision"`

	Data *GroupData `json:"data,omitempty"`
}

//GroupData a contact group alias
type GroupData struct {
	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`
}

//Identity data exchanged in a profile message
type Identity struct {
	Revision int64 `json:"revision"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	Image string `json:"image,omitempty"`

	Version string `json:"version"`

	Node string `json:"node"`
}

//IDList general list of ids
type IDList struct {
	IDs []string `json:"ids"`
}

//LoginAccess response object when app is associated
type LoginAccess struct {
  GUID string `json:"guid"`

	AppToken string `json:"appToken"`

	Created int64 `json:"created"`

  PushSupported bool `json:"pushSupported"`
}

//NodeConfig node configuration values
type NodeConfig struct {
	Domain string `json:"domain"`

	EnableImage bool `json:"enableImage"`

	EnableAudio bool `json:"enableAudio"`

	EnableVideo bool `json:"enableVideo"`

	KeyType string `json:"keyType"`

	AccountStorage int64 `json:"accountStorage"`

  PushSupported bool `json:"pushSupported"`
}

//Profile public attributes of account
type Profile struct {
	GUID string `json:"guid"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	Image string `json:"image,omitempty"`

  Seal string `json:"seal,omitempty"`

	Revision int64 `json:"revision"`

	Version string `json:"version,omitempty"`

	Node string `json:"node"`
}

//ProfileData subset of profile attributes to set
type ProfileData struct {
	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`
}

//Revision revision of each account module
type Revision struct {
	Account int64 `json:"account"`

	Profile int64 `json:"profile"`

	Article int64 `json:"article"`

	Group int64 `json:"group"`

	Channel int64 `json:"channel"`

	Card int64 `json:"card"`
}

//Seal key for channel sealing
type Seal struct {
	PasswordSalt string `json:"passwordSalt"`

	PrivateKeyIV string `json:"privateKeyIv,omitempty"`

  PrivateKeyEncrypted string `json:"privateKeyEncrypted,omitempty"`

	PublicKey string `json:"publicKey,omitempty"`
}

//SignedData object serialized in message
type SignedData struct {
	GUID string `json:"guid"`

	Timestamp int64 `json:"timestamp"`

	MessageType string `json:"messageType"`

	Value string `json:"value"`
}

//Subject payload of attribute, channel, topic or tag
type Subject struct {
	DataType string `json:"dataType"`

	Data string `json:"data"`
}

//Tag slot for tags associated with topic
type Tag struct {
	ID string `json:"id"`

	Revision int64 `json:"revision"`

	Data *TagData `json:"data"`
}

//TagData data associated with topic
type TagData struct {
	GUID string `json:"guid"`

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`
}

//Topic slot for object associated with channel
type Topic struct {
	ID string `json:"id"`

	Revision int64 `json:"revision"`

	Data *TopicData `json:"data"`
}

//TopicData data and revision of posted topic and tags
type TopicData struct {
	DetailRevision int64 `json:"detailRevision"`

	TagRevision int64 `json:"tagRevision"`

	TopicDetail *TopicDetail `json:"topicDetail,omitempty"`
}

//TopicDetail payload of topic
type TopicDetail struct {
	GUID string `json:"guid"`

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`

	Status string `json:"status"`

	Transform string `json:"transform,omitempty"`
}
