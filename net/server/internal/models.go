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


