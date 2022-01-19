package databag

import (
  "log"
  "sync"
	"net/http"
  "encoding/json"
  "github.com/gorilla/websocket"
  "databag/internal/store"
)

type accountRevision struct {
  ProfileRevision int64
  ContentRevision int64
  ViewRevision int64
  GroupRevision int64
  LabelRevision int64
  CardRevision int64
  DialogueRevision int64
  InsightRevision int64
}

var wsSync sync.Mutex
var wsExit = make(chan bool, 1)
var statusListener = make(map[uint][]chan<-[]byte)
var upgrader = websocket.Upgrader{}

func Status(w http.ResponseWriter, r *http.Request) {

  // accept websocket connection
  conn, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
      log.Println("Status: failed upgrade connection")
      return
  }
  defer conn.Close()

  // receive announce
	t, m, err := conn.ReadMessage()
  if t != websocket.TextMessage || err != nil {
    LogMsg("failed to receive announce")
    return
	}
	var announce Announce
	if json.Unmarshal(m, &announce) != nil {
    LogMsg("invalid announce")
    return
	}

  // retrieve reference account
  var app store.App
  if store.DB.Preload("Account").Where("token = ?", announce.AppToken).First(&app).Error != nil {
    LogMsg("invalid app token")
    return
  }

  // send current version
  rev := getRevision(app.Account)
  var msg []byte
  msg, err = json.Marshal(rev)
  if err != nil {
    log.Println("Status - failed to marshal revision")
    return
  }
  err = conn.WriteMessage(websocket.TextMessage, msg)
  if err != nil {
    log.Println("Status - failed to send initial revision")
    return
  }

  // open channel for revisions
  c := make(chan []byte)
  defer close(c)

  // register channel for revisions
  AddStatusListener(app.Account.ID, c)
  defer RemoveStatusListener(app.Account.ID, c)

  // send revision until channel is closed
  for {
		select {
		case msg := <-c:
      err = conn.WriteMessage(websocket.TextMessage, msg)
      if err != nil {
        log.Println("Status - failed to send revision, closing")
        return
      }
		case <-wsExit:
			log.Println("Status - server exit")
      wsExit<-true
			return
		}
	}
}

func getRevision(account store.Account) Revision {
  var r Revision
  r.Profile = account.ProfileRevision
  r.Content = account.ContentRevision
  r.Label = account.LabelRevision
  r.Group = account.GroupRevision
  r.Card = account.CardRevision
  r.Dialogue = account.DialogueRevision
  r.Insight = account.InsightRevision
  return r
}

func ExitStatus() {
  wsExit <- true
}

func SetStatus(account store.Account) {

  // get revisions for the account
  rev := getRevision(account);
  msg, err := json.Marshal(rev)
  if err != nil {
    log.Println("SetStatus - failed to marshal revision")
    return
  }

  // lock access to statusListener
  wsSync.Lock()
  defer wsSync.Unlock()

  // notify all listeners
  chs, ok := statusListener[account.ID]
  if ok {
    for _, ch := range chs {
      ch <- msg
    }
  }
}

func AddStatusListener(act uint, ch chan<-[]byte) {

  // lock access to statusListener
  wsSync.Lock()
  defer wsSync.Unlock()

  // add new listener to map
  chs, ok := statusListener[act]
  if ok {
    chs = append(chs, ch)
  } else {
    statusListener[act] = []chan<-[]byte{ch}
  }
}

func RemoveStatusListener(act uint, ch chan<-[]byte) {

  // lock access to statusListener
  wsSync.Lock()
  defer wsSync.Unlock()

  // remove channel from map
  chs, ok := statusListener[act]
  if ok {
    for i, c := range chs {
      if ch == c {
        if len(chs) == 1 {
          delete(statusListener, act)
        } else {
          chs[i] = chs[len(chs)-1]
          statusListener[act] = chs[:len(chs)-1]
        }
      }
    }
  }
}

