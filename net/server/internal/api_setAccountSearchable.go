package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
)

//SetAccountSearchable sets public visibility of account
func SetAccountSearchable(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var flag bool
	if err := ParseRequest(r, w, &flag); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Model(account).Update("searchable", flag).Error; res != nil {
			ErrResponse(w, http.StatusInternalServerError, res)
			return res
		}
    account.AccountRevision += 1;
		if res := tx.Model(&account).Update("account_revision", account.AccountRevision).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	SetStatus(account)
	WriteResponse(w, nil)
}
