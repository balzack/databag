package databag

import (
	"databag/internal/store"
  "github.com/gorilla/mux"
	"net/http"
)

//AddFlag adds a UGC alert for specified account and or content
func AddFlag(w http.ResponseWriter, r *http.Request) {

  params := mux.Vars(r)
  guid := params["guid"]

  channel := r.FormValue("channel")
  topic := r.FormValue("topic")

	flag := &store.Flag{
    GUID: guid,
    ChannelSlotID: channel,
    TopicSlotID: topic,
  }
  if res := store.DB.Save(flag).Error; res != nil {
		ErrResponse(w, http.StatusInternalServerError, res)
		return
  }

	WriteResponse(w, nil)
}
