package databag

import (
	"databag/internal/store"
	"encoding/json"
	"errors"
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
	"time"
)

var wsSync sync.Mutex
var wsExit = make(chan bool, 1)
var statusListener = make(map[uint][]chan<- []byte)
var revisionListener = make(map[uint][]chan<- []byte)
var disconnectListener = make(map[uint][]chan<- bool)
var upgrader = websocket.Upgrader{}

//Status handler for websocket connection
func Status(w http.ResponseWriter, r *http.Request) {

  // send ringing updates
  ringMode := r.FormValue("mode") == "ring"

	// accept websocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		ErrMsg(err)
		return
	}
	defer conn.Close()
	conn.SetReadLimit(APPBodyLimit)

	// receive announce
	t, m, res := conn.ReadMessage()
	if res != nil {
		ErrMsg(res)
		return
	}
	if t != websocket.TextMessage {
		ErrMsg(errors.New("invalid websocket message type"))
		return
	}
	var a Announce
	if err := json.Unmarshal(m, &a); err != nil {
		ErrMsg(err)
		return
	}

	// extract token target and access
	target, access, ret := ParseToken(a.AppToken)
	if ret != nil {
		ErrMsg(ret)
		return
	}

	// retrieve reference account
	var session store.Session
	if err := store.DB.Preload("Account").Where("account_id = ? AND token = ?", target, access).First(&session).Error; err != nil {
    conn.WriteMessage(websocket.TextMessage, []byte(""))
		ErrMsg(err)
		return
	}

	// send current version
	rev := getRevision(&session.Account)
	var msg []byte
  if ringMode {
    msg, err = json.Marshal(rev)
  } else {
    msg, err = json.Marshal(rev.Revision)
  }
	if err != nil {
		ErrMsg(err)
		return
	}
	if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
		ErrMsg(err)
		return
	}

	// open channel for revisions
	c := make(chan []byte)
	defer close(c)

	// register channel for updates
  if ringMode {
    addStatusListener(session.Account.ID, c)
    defer removeStatusListener(session.Account.ID, c)
  } else {
    addRevisionListener(session.Account.ID, c)
    defer removeRevisionListener(session.Account.ID, c)
  }

  // open channel for disconnection
  d := make(chan bool)
  defer close(d)

  // register channel for updates
  addDisconnectListener(session.Account.ID, d)
  defer removeDisconnectListener(session.Account.ID, d)

	// start ping pong ticker
	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()

	// send revision until channel is closed
	for {
		select {
		case msg := <-c:
			if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				ErrMsg(err)
				return
			}
		case <-ticker.C:
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				ErrMsg(err)
				return
			}
    case <-d:
      LogMsg("user discconection")
      return
		case <-wsExit:
			LogMsg("exiting server")
			wsExit <- true
			return
		}
	}
}

func getRevision(account *store.Account) Activity {
	var r Revision
	r.Account = account.AccountRevision
	r.Profile = account.ProfileRevision
	r.Article = account.ArticleRevision
	r.Channel = account.ChannelRevision
	r.Group = account.GroupRevision
	r.Card = account.CardRevision

  var a Activity
  a.Revision = &r
	return a
}

//ExitStatus closes websocket handler
func ExitStatus() {
	wsExit <- true
}

//SetRing sends ring object on all account websockets
func SetRing(card *store.Card, ring Ring) {

  // serialize ring activity
  var phone Phone
  phone.CallID = ring.CallID
  phone.CalleeToken = ring.CalleeToken
  phone.Ice = ring.Ice
  phone.IceURL = ring.IceURL
  phone.IceUsername = ring.IceUsername
  phone.IcePassword = ring.IcePassword
  phone.CardID = card.CardSlot.CardSlotID
  var a Activity
  a.Phone = &phone;
  msg, err := json.Marshal(a)
  if err != nil {
    ErrMsg(err);
    return
  }

  // lock access to statusListener
  wsSync.Lock()
  defer wsSync.Unlock()

  // notify all listeners
  chs, ok := statusListener[card.Account.ID]
  if ok {
    for _, ch := range chs {
      ch <- msg
    }
  }
}

//SetStatus sends revision object on all account websockets
func SetStatus(account *store.Account) {

	// get revisions for the account
	rev := getRevision(account)
	full, errFull := json.Marshal(rev)
	if errFull != nil {
		ErrMsg(errFull)
		return
	}
	base, errBase := json.Marshal(rev.Revision)
	if errBase != nil {
		ErrMsg(errBase)
		return
	}

	// lock access to statusListener
	wsSync.Lock()
	defer wsSync.Unlock()

	// notify all base listeners
	chs, ok := revisionListener[account.ID]
	if ok {
		for _, ch := range chs {
			ch <- base
		}
	}

	// notify all full listeners
	chs, ok = statusListener[account.ID]
	if ok {
		for _, ch := range chs {
			ch <- full
		}
	}
}

//ClearStatus disconnects websockets from account
func ClearStatus(account *store.Account) {

  // lock access to statusListener
  wsSync.Lock()
  defer wsSync.Unlock();

  // notify all disconnect listeners
  chs, ok := disconnectListener[account.ID]
  if ok {
    for _, ch := range chs {
      ch <- true
    }
  }
}

func addStatusListener(act uint, ch chan<- []byte) {

	// lock access to statusListener
	wsSync.Lock()
	defer wsSync.Unlock()

	// add new listener to map
	chs, ok := statusListener[act]
	if ok {
		statusListener[act] = append(chs, ch)
	} else {
		statusListener[act] = []chan<- []byte{ch}
	}
}

func removeStatusListener(act uint, ch chan<- []byte) {

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

func addRevisionListener(act uint, ch chan<- []byte) {

	// lock access to revisionListener
	wsSync.Lock()
	defer wsSync.Unlock()

	// add new listener to map
	chs, ok := revisionListener[act]
	if ok {
		revisionListener[act] = append(chs, ch)
	} else {
		revisionListener[act] = []chan<- []byte{ch}
	}
}

func removeRevisionListener(act uint, ch chan<- []byte) {

	// lock access to revisionListener
	wsSync.Lock()
	defer wsSync.Unlock()

	// remove channel from map
	chs, ok := revisionListener[act]
	if ok {
		for i, c := range chs {
			if ch == c {
				if len(chs) == 1 {
					delete(revisionListener, act)
				} else {
					chs[i] = chs[len(chs)-1]
					revisionListener[act] = chs[:len(chs)-1]
				}
			}
		}
	}
}

func addDisconnectListener(act uint, ch chan<- bool) {

  // lock access to disconnectListener
  wsSync.Lock()
  defer wsSync.Unlock()

  // add new listener to map
  chs, ok := disconnectListener[act]
  if ok {
    disconnectListener[act] = append(chs, ch)
  } else {
    disconnectListener[act] = []chan<- bool{ch}
  }
}

func removeDisconnectListener(act uint, ch chan<- bool) {

  // lock access to revisionListener
  wsSync.Lock()
  defer wsSync.Unlock()

  // remove channel from map
  chs, ok := disconnectListener[act]
  if ok {
    for i, c := range chs {
      if ch == c {
        if len(chs) == 1 {
          delete(disconnectListener, act)
        } else {
          chs[i] = chs[len(chs)-1]
          disconnectListener[act] = chs[:len(chs)-1]
        }
      }
    }
  }
}

