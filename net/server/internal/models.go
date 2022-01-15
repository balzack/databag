package databag

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

