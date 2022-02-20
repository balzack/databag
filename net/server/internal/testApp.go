package databag

import (
  "time"
  "errors"
  "sync"
  "encoding/json"
  "github.com/gorilla/websocket"
)

const TEST_TIMEOUT = 5

type TestCondition struct {
  check func(*TestApp) bool
  channel chan bool
}

type TestChannel struct {
  channel Channel
  topics map[string]Topic
}

type TestContactData struct {
  card Card
  articles map[string]Article
  channels map[string]TestChannel
}

func NewTestApp() *TestApp {
  return &TestApp{
    articles: make(map[string]Article),
    channels: make(map[string]TestChannel),
    contacts: make(map[string]TestContactData),
  }
}

type TestApp struct {
  name string
  revision Revision
  profile Profile
  articles map[string]Article
  channels map[string]TestChannel
  contacts map[string]TestContactData

  token string

  mutex sync.Mutex
  condition *TestCondition
}

func (a *TestApp) UpdateProfile() error {
  var profile Profile
  err := ApiTestMsg(GetProfile, "GET", "/profile", nil, nil, APP_TOKENAPP, a.token, &profile, nil)
  if err == nil {
    a.profile = profile
  }
  return err
}

func (a *TestApp) UpdateApp(rev *Revision) {
  a.mutex.Lock()
  defer a.mutex.Unlock()

  if rev.Profile != a.revision.Profile {
    if err := a.UpdateProfile(); err != nil {
      PrintMsg(err)
    } else {
      a.revision.Profile = rev.Profile
    }
  }

  if a.condition != nil {
    if a.condition.check(a) {
      a.condition.channel <- true
    }
  }
}

func (a *TestApp) Connect(token string) error {
  var revision Revision
  var data []byte
  var dataType int

  a.token = token

  // connect websocket
  ws, err := StatusConnection(token, &revision)
  if err != nil {
    return err
  }
  a.UpdateApp(&revision)

  // reset any timeout
  ws.SetReadDeadline(time.Time{})

  // read revision update
  for ;; {
    if dataType, data, err = ws.ReadMessage(); err != nil {
      return errors.New("failed to read status conenction")
    }
    if dataType != websocket.TextMessage {
      return errors.New("invalid status data type")
    }
    rev := &Revision{}
    if err = json.Unmarshal(data, rev); err != nil {
      return errors.New("invalid status data")
    }
    a.UpdateApp(rev)
  }

}

func (a *TestApp) setCondition(test *TestCondition) {
  a.mutex.Lock()
  if test.check(a) {
    test.channel <- true
  } else {
    a.condition = test
  }
  a.mutex.Unlock()
}

func (a *TestApp) clearCondition() {
  a.mutex.Lock()
  a.condition = nil
  a.mutex.Unlock()
}

func (a *TestApp) WaitFor(check func(*TestApp) bool) error {
  var done = make(chan bool, 1)
  var wake = make(chan bool, 1)
  a.setCondition(&TestCondition{channel: done, check: check, })
  go func(){
    time.Sleep(TEST_TIMEOUT * time.Second)
    wake <- true
  }()
  select {
  case <-done:
    a.clearCondition()
    return nil
  case <-wake:
    a.clearCondition()
    return errors.New("timeout waiting for condition")
  }
}


