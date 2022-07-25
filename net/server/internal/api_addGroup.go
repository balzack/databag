package databag

import (
	"databag/internal/store"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
)

//AddGroup adds a group to account identified by agent query param
func AddGroup(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var subject Subject
	if err := ParseRequest(r, w, &subject); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	slot := &store.GroupSlot{}
	err = store.DB.Transaction(func(tx *gorm.DB) error {

		data := &store.GroupData{
			Data:      subject.Data,
			AccountID: account.ID,
		}
		if res := tx.Save(data).Error; res != nil {
			return res
		}

		group := &store.Group{}
		group.AccountID = account.ID
		group.GroupDataID = data.ID
		group.DataType = subject.DataType
		if res := tx.Save(group).Error; res != nil {
			return res
		}

		slot.GroupSlotID = uuid.New().String()
		slot.AccountID = account.ID
		slot.GroupID = group.ID
		slot.Revision = account.GroupRevision + 1
		slot.Group = group
		if res := tx.Save(slot).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("group_revision", account.GroupRevision+1).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	SetStatus(account)
	WriteResponse(w, getGroupModel(slot))
}
