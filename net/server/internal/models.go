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
	Attached int64 `json:"attached"`
}

type AppData struct {
	Name string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Url string `json:"url,omitempty"`
	Image string `json:"image,omitempty"`
}

type Subject struct {
	DataType string `json:"dataType"`
	Data string `json:"data"`
}

type Article struct {
  ArticleId string `json:"article_id"`
  Revision int64 `json:"revision"`
	ArticleData *ArticleData `json:"articleData"`
}

type ArticleData struct {
	DataType string `json:"type"`
	Data string `json:"data"`
	Created int64 `json:"created"`
	Updated int64 `json:"updated"`
	Status string `json:"status"`
	Labels []string `json:"labels"`
	Groups []string `json:"groups,omitempty"`
	TagCount int32 `json:"tagCount"`
	TagUpdated int64 `json:"tagUpdated,omitempty"`
	TagRevision int64 `json:"tagRevision"`
}

type ArticleAccess struct {
	Labels []string `json:"labels"`
	Groups []string `json:"groups"`
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

type Card struct {
	CardId string `json:"cardId"`
	Revision int64 `json:"revision,omitempty"`
	CardData *CardData `json:"articleData"`
}

type CardData struct {
	Guid string `json:"guid"`
	Status string `json:"status"`
	Token string `json:"token,omitempty"`
	DetailRevision int64 `json:"detailRevision"`
	ProfileRevision int64 `json:"profileRevision"`
	NotifiedProfile int64 `json:"notifiedProfile"`
	NotifiedContent int64 `json:"notifiedContent"`
	NotifiedLabel int64 `json:"notifiedLabel"`
	NotifiedView int64 `json:"notifiedView"`
}

type CardDetail struct {
	Revision int64 `json:"revision,omitempty"`
	Notes string `json:"notes,omitempty"`
	Groups []string `json:"groups,omitempty"`
}

type CardProfile struct {
	Revision int64 `json:"revision,omitempty"`
	Handle string `json:"handle,omitempty"`
	Name string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Location string `json:"location,omitempty"`
	ImageSet bool `json:"imageSet,omitempty"`
	Version string `json:"version"`
	Node string `json:"node"`
}

type Dialogue struct {
	DialogueId string `json:"dialogueId"`
	DialogueRevison int64 `json:"dialogueRevison,omitempty"`
	Type_ string `json:"type"`
	Data string `json:"data"`
	Created int64 `json:"created"`
	Active bool `json:"active"`
	InsightRevision int64 `json:"insightRevision,omitempty"`
	Insights []DialogueInsights `json:"insights"`
}

type DialogueIdSubjectBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type DialogueInsights struct {
	CardId string `json:"cardId,omitempty"`
	Status string `json:"status,omitempty"`
}

type Group struct {
	GroupId string `json:"groupId"`
  Revision int64 `json:"revision"`
	GroupData *GroupData `json:"groupData"`
}

type GroupData struct {
	DataType string `json:"dataType"`
	Data string `json:"data"`
	Created int64 `json:"created"`
	Updated int64 `json:"updated"`
}

type GroupsGroupIdBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type Insight struct {
	InsightId string `json:"insightId"`
	InsightRevision int64 `json:"insightRevision"`
	CardId string `json:"cardId"`
	Status string `json:"status"`
}

type Label struct {
	LabelId string `json:"labelId"`
  Revision int64 `json:"revision"`
	LabelData *LabelData `json:"labelData"`
}

type LabelData struct {
	DataType string `json:"type"`
	Data string `json:"data"`
	Created int64 `json:"created"`
	Updated int64 `json:"updated"`
	Groups []string `json:"groups,omitempty"`
}

type NodeConfig struct {
	Domain string `json:"domain"`
	PublicLimit int64 `json:"publicLimit"`
	AccountStorage int64 `json:"accountStorage"`
}

type Profile struct {
	Guid string `json:"profileId"`
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
	Content int64 `json:"content"`
	Label int64 `json:"label"`
	Group int64 `json:"share"`
	Card int64 `json:"card"`
	Dialogue int64 `json:"dialogue"`
	Insight int64 `json:"insight"`
}

type ShareGroupsBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type Tag struct {
	TagId string `json:"tagId"`
	CardId string `json:"cardId,omitempty"`
	Revision int64 `json:"revision"`
	Type_ string `json:"type"`
	Data string `json:"data"`
	Created int64 `json:"created"`
}

type Topic struct {
	TopicId string `json:"topicId"`
	TopicRevision int64 `json:"topicRevision"`
	Type_ string `json:"type"`
	Data string `json:"data"`
	Created int64 `json:"created"`
	Modified int64 `json:"modified"`
	Status string `json:"status"`
	TagCount int32 `json:"tagCount"`
	TagUpdate int64 `json:"tagUpdate,omitempty"`
	TagRevision int64 `json:"tagRevision"`
}

type TopicIdAssetsBody struct {
	FileName **os.File `json:"fileName,omitempty"`
}

type TopicIdSubjectBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type TopicIdTagsBody struct {
	Type_ string `json:"type"`
	Data string `json:"data"`
}

type Tunnel struct {
	CardId string `json:"cardId"`
	Type_ string `json:"type"`
	Data string `json:"data,omitempty"`
}

type ContactStatus struct {
	Token string `json:"token,omitempty"`
	Status string `json:"status"`
}

type DataMessage struct {
	Message string `json:"message"`
	KeyType string `json:"keyType"`
	PublicKey string `json:"publicKey"`
	Signature string `json:"signature"`
	SignatureType string `json:"signatureType"`
}

type SignedData struct {
	Guid string `json:"guid"`
	Timestamp int64 `json:"timestamp"`
	MessageType string `json:"messageType"`
	Value string `json:"value"`
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

type Connect struct {
	Contact string `json:"contact"`
	Token string `json:"token"`
  ViewRevision int64 `json:"viewRevision"`
	ContentRevision int64 `json:"contentRevision"`
	ProfileRevision int64 `json:"profileRevision,omitempty"`
	Handle string `json:"handle,omitempty"`
	Name string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Location string `json:"location,omitempty"`
	Image string `json:"image,omitempty"`
	Version string `json:"version,omitempty"`
	Node string `json:"node,omitempty"`
}

type Disconnect struct {
	Contact string `json:"contact"`
}

type Authenticate struct {
	Token string `json:"token"`
}

