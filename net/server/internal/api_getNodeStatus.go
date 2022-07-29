package databag

import (
	"databag/internal/store"
	"errors"
	"gorm.io/gorm"
	"net/http"
)

//GetNodeStatus query if node admin token has been set
func GetNodeStatus(w http.ResponseWriter, r *http.Request) {
	var config store.Config
	err := store.DB.Where("config_id = ?", CNFConfigured).First(&config).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			WriteResponse(w, true)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}
	WriteResponse(w, false)
}
