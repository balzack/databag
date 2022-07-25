package databag

import (
	"databag/internal/store"
	"net/http"
	"strconv"
)

//GetGroups retrieves list of groups in account
func GetGroups(w http.ResponseWriter, r *http.Request) {
	var groupRevisionSet bool
	var groupRevision int64

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	group := r.FormValue("revision")
	if group != "" {
		groupRevisionSet = true
		if groupRevision, err = strconv.ParseInt(group, 10, 64); err != nil {
			ErrResponse(w, http.StatusBadRequest, err)
			return
		}
	}

	var slots []store.GroupSlot
	if groupRevisionSet {
		if err := store.DB.Preload("Group.GroupData").Where("account_id = ? AND revision > ?", account.ID, groupRevision).Find(&slots).Error; err != nil {
			ErrResponse(w, http.StatusInternalServerError, err)
			return
		}
	} else {
		if err := store.DB.Preload("Group.GroupData").Where("account_id = ? AND group_id != 0", account.ID).Find(&slots).Error; err != nil {
			ErrResponse(w, http.StatusInternalServerError, err)
			return
		}
	}

	response := []*Group{}
	for _, slot := range slots {
		response = append(response, getGroupModel(&slot))
	}

	w.Header().Set("Group-Revision", strconv.FormatInt(account.GroupRevision, 10))
	WriteResponse(w, response)
}
