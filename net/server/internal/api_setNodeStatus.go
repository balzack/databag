package databag

import (
	"databag/internal/store"
	"errors"
	"gorm.io/gorm"
	"net/http"
)

func SetNodeStatus(w http.ResponseWriter, r *http.Request) {

	var config store.Config
	err := store.DB.Where("config_id = ?", CNFConfigured).First(&config).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if config.BoolValue {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	token := r.FormValue("token")
	if token == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Create(&store.Config{ConfigID: CNFToken, StrValue: token}).Error; res != nil {
			return res
		}
		if res := tx.Create(&store.Config{ConfigID: CNFConfigured, BoolValue: true}).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		LogMsg("SetNodeCalim - failed to store credentials")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
