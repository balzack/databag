package databag

import (
	"os"
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

type AccountsImportBody struct {
	FileName **os.File `json:"fileName,omitempty"`
}

type Announce struct {
	AppToken string `json:"appToken"`
}

type App struct {
	AppId string `json:"appId"`
	AppData *AppData `json:"appData"`
	Attached int32 `json:"attached"`
}

type AppData struct {
	Name string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Url string `json:"url,omitempty"`
	Image string `json:"image,omitempty"`
}

type Article struct {
	ArticleId string `json:"articleId"`
	ArticleRevision int64 `json:"articleRevision"`
	Type_ string `json:"type"`
	Data string `json:"data"`
	Created int32 `json:"created"`
	Modified int32 `json:"modified"`
	Status string `json:"status"`
	Labels []string `json:"labels"`
	Groups []string `json:"groups,omitempty"`
	TagCount int32 `json:"tagCount"`
	TagUpdate int32 `json:"tagUpdate,omitempty"`
	TagRevision int64 `json:"tagRevision"`
}

type ArticleIdAssetsBody struct {
	FileName **os.File `json:"fileName,omitempty"`
}

type ArticleIdSubjectBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type Asset struct {
	AssetId string `json:"assetId"`
	Transform string `json:"transform,omitempty"`
	Status string `json:"status,omitempty"`
}

type Authenticate struct {
	Token string `json:"token"`
	Timestamp int32 `json:"timestamp"`
}

type Card struct {
	CardId string `json:"cardId"`
	CardProfile *CardProfile `json:"cardProfile"`
	CardData *CardData `json:"cardData"`
	ProfileRevision int64 `json:"profileRevision"`
	ContentRevision int64 `json:"contentRevision"`
}

type CardData struct {
	Revision int64 `json:"revision,omitempty"`
	Status string `json:"status"`
	Notes string `json:"notes,omitempty"`
	Token string `json:"token,omitempty"`
	Groups []string `json:"groups,omitempty"`
}

type CardProfile struct {
	Handle string `json:"handle,omitempty"`
	Name string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Location string `json:"location,omitempty"`
	Revision int64 `json:"revision,omitempty"`
	ImageSet bool `json:"imageSet,omitempty"`
	Node string `json:"node"`
}

type CardView struct {
	CardId string `json:"cardId"`
	CardRevision int64 `json:"cardRevision"`
	ProfileRevision int64 `json:"profileRevision"`
	ContentRevision int64 `json:"contentRevision"`
}

type Connect struct {
	RequestorcardId string `json:"requestorcardId,omitempty"`
	RequestedcardId string `json:"requestedcardId,omitempty"`
	Timestamp int32 `json:"timestamp"`
	Profile *Profile `json:"profile"`
	Token string `json:"token"`
	ContentRevision int64 `json:"contentRevision"`
}

type ContentArticlesBody struct {
	Labels []string `json:"labels"`
	Groups []string `json:"groups"`
}

type ContentLabelsBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type DataMessage struct {
	MessageType string `json:"messageType"`
	Message string `json:"message"`
	KeyType string `json:"keyType"`
	PublicKey string `json:"publicKey"`
	Signature string `json:"signature"`
}

type DialogueIdSubjectBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type DialogueInsights struct {
	CardId string `json:"cardId,omitempty"`
	Status string `json:"status,omitempty"`
}

type Disconnect struct {
	RequestorId string `json:"requestorId"`
	RequestedId string `json:"requestedId"`
	Timestamp int32 `json:"timestamp"`
}

type Group struct {
	GroupId string `json:"groupId"`
	GroupRevision int64 `json:"groupRevision"`
	Type_ string `json:"type"`
	Data string `json:"data"`
	Created int32 `json:"created"`
	Modified int32 `json:"modified"`
}

type GroupsGroupIdBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type InlineResponse200 struct {
	Token string `json:"token,omitempty"`
	Status string `json:"status"`
}

type InlineResponse2001 struct {
	Id string `json:"id,omitempty"`
	Revision int64 `json:"revision,omitempty"`
}

type InlineResponse2002 struct {
	BlockId string `json:"blockId,omitempty"`
	BlockRevision int64 `json:"blockRevision,omitempty"`
	Tag *Tag `json:"tag,omitempty"`
}

type InlineResponse201 struct {
	BlockId string `json:"blockId,omitempty"`
	BlockRevision int64 `json:"blockRevision,omitempty"`
	Article *Article `json:"article,omitempty"`
}

type InlineResponse2011 struct {
	BlockId string `json:"blockId,omitempty"`
	BlockRevision int64 `json:"blockRevision,omitempty"`
	Topic *Topic `json:"topic,omitempty"`
}

