package databag

import (
	"net/http"
)

//AddRing notifies users of requested call
func AddRing(w http.ResponseWriter, r *http.Request) {

	card, code, err := ParamContactToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var ring Ring
	if err := ParseRequest(r, w, &ring); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

  // push event on first ring
  if ring.Index == 0 {
    SendPushEvent(card.Account, "ring");
  }

  SetRing(card, ring);

	WriteResponse(w, nil)
}
