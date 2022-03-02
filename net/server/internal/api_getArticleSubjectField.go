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

func GetArticleSubjectField(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  articleId := params["articleId"]
  field := params["field"]
  elements := strings.Split(field, ".")

  var guid string
  var act *store.Account
  tokenType := r.Header.Get("TokenType")
  if tokenType == APP_TOKENAPP {
    account, code, err := BearerAppToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = account
  } else if tokenType == APP_TOKENCONTACT {
    card, code, err := BearerContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = &card.Account
    guid = card.Guid
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("unknown token type"))
    return
  }

  // load article
  var slot store.ArticleSlot
  if err := store.DB.Preload("Article.Groups.Cards").Where("account_id = ? AND article_slot_id = ?", act.ID, articleId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Article == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced article missing"))
    return
  }

  // check if article is shared
  if tokenType == APP_TOKENCONTACT && !isArticleShared(guid, slot.Article) {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced article not shared"))
    return
  }

  // decode data
  strData := fastjson.GetString([]byte(slot.Article.Data), elements...)
  binData, err := base64.StdEncoding.DecodeString(strData)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, err)
    return
  }

  // response with content
  http.ServeContent(w, r, field, time.Unix(slot.Article.Updated, 0), bytes.NewReader(binData))
}

