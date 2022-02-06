package databag

import (
  "errors"
  "strconv"
  "net/http"
  "databag/internal/store"
)

func GetLabels(w http.ResponseWriter, r *http.Request) {
  var res error
  var viewRevision int64
  var labelRevision int64
  var revisionSet bool

  view := r.FormValue("viewRevision")
  if view != "" {
    if viewRevision, res = strconv.ParseInt(view, 10, 64); res != nil {
      ErrResponse(w, http.StatusBadRequest, res)
      return
    }
  }
  label := r.FormValue("labelRevision")
  if label != "" {
    if labelRevision, res = strconv.ParseInt(label, 10, 64); res != nil {
      ErrResponse(w, http.StatusBadRequest, res)
      return
    }
    revisionSet = true
  }

  tokenType := r.Header.Get("TokenType")
  var response []*Label
  if tokenType == APP_TOKENAPP {

    account, code, err := BearerAppToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    var labels []store.LabelSlot
    if err := getAccountLabels(account, labelRevision, &labels); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    for _, label := range labels {
      response = append(response, getLabelModel(&label, false, true))
    }

    w.Header().Set("Label-Revision", strconv.FormatInt(account.LabelRevision, 10))
  } else if tokenType == APP_TOKENCONTACT {

    card, code, err := BearerContactToken(r, false)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }

    if viewRevision != card.ViewRevision {
      if revisionSet {
        ErrResponse(w, http.StatusGone, errors.New("label view unavailable"))
        return
      }
    }

    var labels []store.LabelSlot
    if err := getContactLabels(card, labelRevision, &labels); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }

    for _, label := range labels {
      if isLabelShared(&label, card.Guid) {
        response = append(response, getLabelModel(&label, true, true))
      } else if revisionSet {
        response = append(response, getLabelModel(&label, true, false))
      }
    }

    w.Header().Set("View-Revision", strconv.FormatInt(card.ViewRevision, 10))
    w.Header().Set("Label-Revision", strconv.FormatInt(card.Account.LabelRevision, 10))
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
  }

  WriteResponse(w, response)
}

// better if this filtering was done in gorm or sql
func isLabelShared(slot *store.LabelSlot, guid string) bool {
  if slot.Label == nil {
    return false
  }
  for _, group := range slot.Label.Groups {
    for _, card := range group.Cards {
      if card.Guid == guid {
        return true
      }
    }
  }
  return false
}

func getAccountLabels(account *store.Account, revision int64, labels *[]store.LabelSlot) error {
  return store.DB.Preload("Label.Groups.GroupSlot").Where("account_id = ? AND revision > ?", account.ID, revision).Find(labels).Error
}

func getContactLabels(card *store.Card, revision int64, labels *[]store.LabelSlot) error {
  return store.DB.Preload("Label.Groups.Cards").Where("account_id = ? AND revision > ?", card.Account.ID, revision).Find(labels).Error
}




