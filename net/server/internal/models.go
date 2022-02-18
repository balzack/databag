package databag

import (
	//"os"
)

type Account struct {

	AccountId string `json:"accountId"`

	Profile *Profile `json:"profile"`

	Disabled bool `json:"disabled"`
}

type AccountStatus struct {

	Disabled bool `json:"disabled"`

	StorageUsed float64 `json:"storageUsed"`

	StorageAvailable float64 `json:"storageAvailable"`

	ForwardingAddress string `json:"forwardingAddress"`
}

type Announce struct {

	AppToken string `json:"appToken"`
}

type App struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *AppData `json:"data"`
}

type AppData struct {

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Url string `json:"url,omitempty"`

	Image string `json:"image,omitempty"`

	Attached int64 `json:"attached"`
}

type Article struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *ArticleData `json:"data"`
}

type ArticleData struct {

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`

	Groups *IdList `json:"groups,omitempty"`
}

type ArticleGroups struct {

	Groups []string `json:"groups"`
}

type Asset struct {

	AssetId string `json:"assetId"`

	Transform string `json:"transform,omitempty"`

	Status string `json:"status,omitempty"`
}

type Card struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *CardData `json:"data"`
}

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

type CardDetail struct {

	Status string `json:"status"`

	Token string `json:"token,omitempty"`

	Notes string `json:"notes,omitempty"`

	Groups []string `json:"groups,omitempty"`
}

type CardProfile struct {

	Guid string `json:"guid"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	ImageSet bool `json:"imageSet,omitempty"`

	Version string `json:"version,omitempty"`

	Node string `json:"node"`
}

type Channel struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *ChannelData `json:"data"`
}

type ChannelData struct {

	DetailRevision int64 `json:"detailRevision"`

	ChannelDetail *ChannelDetail `json:"channelDetail,omitempty"`
}

type ChannelDetail struct {

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`

	Groups *IdList `json:"groups,omitempty"`

  Cards *IdList `json:"cards,omitempty"`

	Members []string `json:"members"`
}

type Claim struct {

	Token string `json:"token"`
}

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

type ContactStatus struct {

	Token string `json:"token,omitempty"`

	ProfileRevision int64 `json:"profileRevision,omitempty"`

	ArticleRevision int64 `json:"articleRevision,omitempty"`

	ChannelRevision int64 `json:"channelRevision,omitempty"`

	ViewRevision int64 `json:"viewRevision,omitempty"`

	Status string `json:"status"`
}

type DataMessage struct {

	Message string `json:"message"`

	KeyType string `json:"keyType"`

	PublicKey string `json:"publicKey"`

	Signature string `json:"signature"`

	SignatureType string `json:"signatureType"`
}

type Disconnect struct {

	Contact string `json:"contact"`
}

type Group struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *GroupData `json:"data,omitempty"`
}

type GroupData struct {

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`
}

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

type IdList struct {

	Ids []string `json:"ids"`
}

type NodeConfig struct {

	Domain string `json:"domain"`

	PublicLimit int64 `json:"publicLimit"`

	AccountStorage int64 `json:"accountStorage"`
}

type Profile struct {

	Guid string `json:"guid"`

	Handle string `json:"handle,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`

	Image string `json:"image,omitempty"`

	Revision int64 `json:"revision"`

	Version string `json:"version,omitempty"`

	Node string `json:"node"`
}

type ProfileData struct {

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	Location string `json:"location,omitempty"`
}

type Revision struct {

	Profile int64 `json:"profile"`

	Article int64 `json:"article"`

	Group int64 `json:"group"`

	Channel int64 `json:"channel"`

	Card int64 `json:"card"`
}

type SignedData struct {

	Guid string `json:"guid"`

	Timestamp int64 `json:"timestamp"`

	MessageType string `json:"messageType"`

	Value string `json:"value"`
}

type Subject struct {

	DataType string `json:"dataType"`

	Data string `json:"data"`
}

type Tag struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *TagData `json:"data"`
}

type TagData struct {

	Guid string `json:"guid"`

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`
}

type Topic struct {

	Id string `json:"id"`

	Revision int64 `json:"revision"`

	Data *TopicData `json:"data"`
}

type TopicData struct {

	DetailRevision int64 `json:"detailRevision"`

	TagRevision int64 `json:"tagRevision"`

	TopicDetail *TopicDetail `json:"topicDetail,omitempty"`

	TopicTags *TopicTags `json:"topicTags:,omitempty"`
}

type TopicDetail struct {

	Guid string `json:"guid"`

	DataType string `json:"dataType"`

	Data string `json:"data"`

	Created int64 `json:"created"`

	Updated int64 `json:"updated"`

	Status string `json:"status"`
}

type TopicTags struct {

	TagCount int32 `json:"tagCount"`

	TagUpdated int64 `json:"tagUpdated"`
}

