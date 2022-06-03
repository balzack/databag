package databag

import (
  "errors"
	"net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func GetNodeStatus(w http.ResponseWriter, r *http.Request) {
  var config store.Config
  err := store.DB.Where("config_id = ?", CONFIG_CONFIGURED).First(&config).Error
  if err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      WriteResponse(w, true)
    } else {
      w.WriteHeader(http.StatusInternalServerError);
    }
    return
  }
  WriteResponse(w, false)
}

