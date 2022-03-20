package databag

import (
  "time"
  "bytes"
  "errors"
  "strings"
  "net/http"
  "gorm.io/gorm"
  "encoding/base64"
  "github.com/gorilla/mux"
  "databag/internal/store"
  "github.com/valyala/fastjson"
)

func GetGroupSubjectField(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  groupId := params["groupId"]
  field := params["field"]
  elements := strings.Split(field, ".")

  account, code, err := ParamAgentToken(r, true);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // load group
  var slot store.GroupSlot
  if err := store.DB.Preload("Group.GroupData").Where("account_id = ? AND group_slot_id = ?", account.ID, groupId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Group == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced group missing"))
    return
  }

  // decode data
  strData := fastjson.GetString([]byte(slot.Group.GroupData.Data), elements...)
  binData, err := base64.StdEncoding.DecodeString(strData)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, err)
    return
  }

  // response with content
  http.ServeContent(w, r, field, time.Unix(slot.Group.Updated, 0), bytes.NewReader(binData))
}

