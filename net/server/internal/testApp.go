package databag

import (
  "time"
  "errors"
  "strconv"
  "sync"
  "encoding/json"
  "net/http"
  "net/http/httptest"
  "github.com/gorilla/websocket"
  "github.com/gorilla/mux"
)

const TEST_TIMEOUT = 5

type TestCondition struct {
  check func(*TestApp) bool
  channel chan bool
}

type TestChannel struct {
  channel Channel
  topics map[string]*Topic
}

type TestContactData struct {
  token string
  card Card
  profileRevision int64
  viewRevision int64
  articleRevision int64
  channelRevision int64
  cardDetailRevision int64
  cardProfileRevision int64
  articles map[string]*Article
  channels map[string]*TestChannel
  offsync bool
}

func (c *TestContactData) UpdateContact() (err error) {

  if c.cardDetailRevision != c.card.Data.DetailRevision {
    if err = c.UpdateContactCardDetail(); err != nil {
      return
    } else {
      c.cardDetailRevision = c.card.Data.DetailRevision
    }
  }

  if c.cardProfileRevision != c.card.Data.ProfileRevision {
    if err = c.UpdateContactCardProfile(); err != nil {
      return
    } else {
      c.cardProfileRevision = c.card.Data.ProfileRevision
    }
  }

  // sync rest only if connected
  if c.card.Data.CardDetail.Status != APP_CARDCONNECTED {
    return
  }

  if c.profileRevision != c.card.Data.NotifiedProfile {
    if err = c.UpdateContactProfile(); err != nil {
      return
    } else {
      c.profileRevision = c.card.Data.NotifiedProfile
    }
  }

  if c.viewRevision != c.card.Data.NotifiedView {
    if err = c.UpdateContactArticle(); err != nil {
      return
    } else if err = c.UpdateContactChannels(); err != nil {
      return
    } else {
      c.articleRevision = c.card.Data.NotifiedArticle
      c.channelRevision = c.card.Data.NotifiedChannel
      c.viewRevision = c.card.Data.NotifiedView
    }
  }

  if c.articleRevision != c.card.Data.NotifiedArticle {
    if err = c.UpdateContactArticle(); err != nil {
      return
    } else {
      c.articleRevision = c.card.Data.NotifiedArticle
    }
  }

  if c.channelRevision != c.card.Data.NotifiedChannel {
    if err = c.UpdateContactChannels(); err != nil {
      return
    } else {
      c.channelRevision = c.card.Data.NotifiedChannel
    }
  }

  return
}

func (c *TestContactData) UpdateContactProfile() (err error) {
  var msg DataMessage
  token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
  params := &TestApiParams{ query: "/profile/message", tokenType: APP_TOKENCONTACT, token: token }
  response := &TestApiResponse{ data: &msg }
  if err = TestApiRequest(GetProfileMessage, params, response); err != nil {
    return
  }
  params = &TestApiParams{ restType: "PUT", query: "/contact/cards/{cardId}/profile", tokenType: APP_TOKENAPP, token: c.token,
    path: map[string]string{ "cardId": c.card.Id }, body: &msg }
  response = &TestApiResponse{}
  if err = TestApiRequest(SetCardProfile, params, response); err != nil {
    return
  }
  return
}

func (c *TestContactData) UpdateContactArticle() (err error) {
  var articles []Article
  if c.articleRevision == 0 || c.viewRevision != c.card.Data.NotifiedView {
    token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
    params := &TestApiParams{ query: "/articles", tokenType: APP_TOKENCONTACT, token: token }
    response := &TestApiResponse{ data: &articles }
    if err = TestApiRequest(GetArticles, params, response); err != nil {
      return
    }
    c.articles = make(map[string]*Article)
  } else {
    token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
    viewRevision := strconv.FormatInt(c.viewRevision, 10)
    articleRevision := strconv.FormatInt(c.articleRevision, 10)
    params := &TestApiParams{ query: "/articles?articleRevision=" + articleRevision + "&viewRevision=" + viewRevision,
        tokenType: APP_TOKENCONTACT, token: token }
    response := &TestApiResponse{ data: &articles }
    if err = TestApiRequest(GetArticles, params, response); err != nil {
      return
    }
  }
  for _, article := range articles {
    if article.Data == nil  {
      delete(c.articles, article.Id)
    } else {
      c.articles[article.Id] = &article
    }
  }
  return nil
}

func (c *TestContactData) UpdateContactChannels() (err error) {
  var channels []Channel
  if c.channelRevision == 0 || c.viewRevision != c.card.Data.NotifiedView {
    token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
    params := &TestApiParams{ query: "/channels", tokenType: APP_TOKENCONTACT, token: token }
    response := &TestApiResponse{ data: &channels }
    if err = TestApiRequest(GetChannels, params, response); err != nil {
      return
    }
  } else {
    token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
    viewRevision := strconv.FormatInt(c.viewRevision, 10)
    channelRevision := strconv.FormatInt(c.channelRevision, 10)
    params := &TestApiParams{ query: "/channels?channelRevision=" + channelRevision + "&viewRevision=" + viewRevision,
        tokenType: APP_TOKENCONTACT, token: token }
    response := &TestApiResponse{ data: &channels }
    if err = TestApiRequest(GetChannels, params, response); err != nil {
      return
    }
  }

  for _, channel := range channels {
    if channel.Data == nil {
      delete(c.channels, channel.Id)
    } else {
      tc, set := c.channels[channel.Id]
      if set {
        if channel.Revision != tc.channel.Revision {
          if err = c.UpdateContactChannel(tc, &channel); err != nil {
            return
          }
          tc.channel.Revision = channel.Revision
        }
      } else {
        tc := &TestChannel{ channel: Channel{ Id: channel.Id } }
        c.channels[channel.Id] = tc
        if err = c.UpdateContactChannel(tc, &channel); err != nil {
          return
        }
        tc.channel.Revision = channel.Revision
      }
    }
  }
  return nil
}

func (c *TestContactData) UpdateContactChannel(testChannel *TestChannel, channel *Channel) (err error) {
  if testChannel.channel.Revision != channel.Revision {
    if channel.Data.ChannelDetail != nil {
      testChannel.channel.Data = channel.Data
    } else if testChannel.channel.Data == nil || testChannel.channel.Data.DetailRevision != channel.Data.DetailRevision {
      token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
      params := &TestApiParams{ query: "/channels/{channelId}", path: map[string]string{ "channelId": channel.Id }, tokenType: APP_TOKENCONTACT, token: token }
      channel := Channel{}
      response := &TestApiResponse{ data: &channel }
      if err = TestApiRequest(GetChannel, params, response); err != nil {
        return
      }
      if channel.Data == nil {
        delete(c.channels, channel.Id)
      }
      testChannel.channel.Data = channel.Data
    }
  }
  err = c.UpdateContactChannelTopics(testChannel)
  return
}

func (c *TestContactData) UpdateContactChannelTopics(testChannel *TestChannel) (err error) {
  var topics []Topic
  if testChannel.channel.Revision == 0 {
    token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
    params := &TestApiParams{ query: "/channels/{channelId}/topics",
      path: map[string]string{ "channelId": testChannel.channel.Id }, tokenType: APP_TOKENCONTACT, token: token }
    response := &TestApiResponse{ data: &topics }
    if err = TestApiRequest(GetChannelTopics, params, response); err != nil {
      return
    }
    testChannel.topics = make(map[string]*Topic)
  } else {
    token := c.card.Data.CardProfile.Guid + "." + c.card.Data.CardDetail.Token
    revision := strconv.FormatInt(testChannel.channel.Revision, 10)
    params := &TestApiParams{ query: "/channels/{channelId}/topics?revision=" + revision,
        path: map[string]string{ "channelId": testChannel.channel.Id }, tokenType: APP_TOKENCONTACT, token: token }
    response := &TestApiResponse{ data: &topics }
    if err = TestApiRequest(GetChannelTopics, params, response); err != nil {
      return
    }
  }
  for _, topic := range topics {
    if topic.Data == nil  {
      delete(testChannel.topics, topic.Id)
    } else {
      testChannel.topics[topic.Id] = &topic
    }
  }
  return nil
}

func (c *TestContactData) UpdateContactCardDetail() (err error) {
  var cardDetail CardDetail
  params := &TestApiParams{ query: "/contact/cards/{cardId}/detail", tokenType: APP_TOKENAPP, token: c.token,
    path: map[string]string{ "cardId": c.card.Id } }
  response := &TestApiResponse{ data: &cardDetail }
  if err = TestApiRequest(GetCardDetail, params, response); err != nil {
    return
  }
  c.card.Data.CardDetail = &cardDetail
  return
}

func (c *TestContactData) UpdateContactCardProfile() (err error) {
  var cardProfile CardProfile
  params := &TestApiParams{ query: "/contact/cards/{cardId}/profile", tokenType: APP_TOKENAPP, token: c.token,
    path: map[string]string{ "cardId": c.card.Id } }
  response := &TestApiResponse{ data: &cardProfile }
  if err = TestApiRequest(GetCardProfile, params, response); err != nil {
    return
  }
  c.card.Data.CardProfile = &cardProfile
  return
}

func NewTestApp() *TestApp {
  return &TestApp{
    groups: make(map[string]*Group),
    articles: make(map[string]*Article),
    channels: make(map[string]*TestChannel),
    contacts: make(map[string]*TestContactData),
  }
}

type TestApp struct {
  name string
  revision Revision
  profile Profile
  groups map[string]*Group
  articles map[string]*Article
  channels map[string]*TestChannel
  contacts map[string]*TestContactData

  token string

  mutex sync.Mutex
  condition *TestCondition
}

func (a *TestApp) UpdateProfile() (err error) {
  params := &TestApiParams{ query: "/profile", tokenType: APP_TOKENAPP, token: a.token }
  response := &TestApiResponse{ data: &a.profile }
  err = TestApiRequest(GetProfile, params, response)
  return
}

func (a *TestApp) UpdateGroups() (err error) {
  var groups []Group
  if a.revision.Group == 0 {
    params := &TestApiParams{ query: "/groups", tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &groups }
    if err = TestApiRequest(GetGroups, params, response); err != nil {
      return
    }
  } else {
    revision := strconv.FormatInt(a.revision.Group, 10)
    params := &TestApiParams{ query: "/groups?revision=" + revision, tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &groups }
    if err = TestApiRequest(GetGroups, params, response); err != nil {
      return
    }
  }
  for _, group := range groups {
    if group.Data == nil  {
      delete(a.groups, group.Id)
    } else {
      a.groups[group.Id] = &group
    }
  }
  return
}

func (a *TestApp) UpdateArticles() (err error) {
  var articles []Article
  if a.revision.Article == 0 {
    params := &TestApiParams{ query: "/articles", tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &articles }
    if err = TestApiRequest(GetArticles, params, response); err != nil {
      return
    }
  } else {
    revision := strconv.FormatInt(a.revision.Article, 10)
    params := &TestApiParams{ query: "/articles?articleRevision=" + revision, tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &articles }
    if err = TestApiRequest(GetArticles, params, response); err != nil {
      return
    }
  }
  for _, article := range articles {
    if article.Data == nil  {
      delete(a.articles, article.Id)
    } else {
      a.articles[article.Id] = &article
    }
  }
  return
}

func (a *TestApp) UpdateChannels() (err error) {
  var channels []Channel
  if a.revision.Channel == 0 {
    params := &TestApiParams{ query: "/channels", tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &channels }
    if err = TestApiRequest(GetChannels, params, response); err != nil {
      return
    }
  } else {
    revision := strconv.FormatInt(a.revision.Channel, 10)
    params := &TestApiParams{ query: "/channels?channelRevision=" + revision, tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &channels }
    if err = TestApiRequest(GetChannels, params, response); err != nil {
      return
    }
  }

  for _, channel := range channels {
    if channel.Data == nil {
      delete(a.channels, channel.Id)
    } else {
      c, set := a.channels[channel.Id]
      if set {
        if channel.Revision != c.channel.Revision {
          if err = a.UpdateChannel(c, &channel); err != nil {
            return
          }
          c.channel.Revision = channel.Revision
        }
      } else {
        c := &TestChannel{ channel: Channel{ Id: channel.Id } }
        a.channels[channel.Id] = c
        if err = a.UpdateChannel(c, &channel); err != nil {
          return
        }
        c.channel.Revision = channel.Revision
      }
    }
  }
  return
}

func (a *TestApp) UpdateChannel(testChannel *TestChannel, channel *Channel) (err error) {
  if testChannel.channel.Revision != channel.Revision {
    if channel.Data.ChannelDetail != nil {
      testChannel.channel.Data = channel.Data
    } else if testChannel.channel.Data == nil || testChannel.channel.Data.DetailRevision != channel.Data.DetailRevision {
      c := Channel{}
      params := &TestApiParams{ query: "/channel/{channelId}", path: map[string]string{ "channelId": channel.Id }, tokenType: APP_TOKENAPP, token: a.token }
      response := &TestApiResponse{ data: &c }
      if err = TestApiRequest(GetChannel, params, response); err != nil {
        return
      }
      if c.Data == nil {
        delete(a.channels, channel.Id)
      }
      testChannel.channel.Data = c.Data
    }
  }
  err = a.UpdateChannelTopics(testChannel)
  return
}

func (a *TestApp) UpdateChannelTopics(testChannel *TestChannel) (err error) {
  var topics []Topic
  if testChannel.channel.Revision == 0 {
    params := &TestApiParams{ query: "/channels/{channelId}/topics",
      path: map[string]string{ "channelId": testChannel.channel.Id }, tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &topics }
    if err = TestApiRequest(GetChannelTopics, params, response); err != nil {
      return
    }
    testChannel.topics = make(map[string]*Topic)
  } else {
    revision := strconv.FormatInt(testChannel.channel.Revision, 10)
    params := &TestApiParams{ query: "/channels/{channelId}/topics?revision=" + revision,
        path: map[string]string{ "channelId": testChannel.channel.Id }, tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &topics }
    if err = TestApiRequest(GetChannelTopics, params, response); err != nil {
      return
    }
  }
  for _, topic := range topics {
    if topic.Data == nil  {
      delete(testChannel.topics, topic.Id)
    } else {
      testChannel.topics[topic.Id] = &topic
    }
  }
  return nil
}

func (a *TestApp) UpdateCards() (err error) {
  var cards []Card
  if a.revision.Card == 0 {
    params := &TestApiParams{ query: "/cards", tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &cards }
    if err = TestApiRequest(GetCards, params, response); err != nil {
      return
    }
    for _, card := range cards {
      if card.Data == nil  {
        delete(a.contacts, card.Id)
      } else {
        // set new card
        contactData := &TestContactData{ card: card, articles: make(map[string]*Article), channels: make(map[string]*TestChannel),
            cardDetailRevision: card.Data.DetailRevision, cardProfileRevision: card.Data.ProfileRevision,
            profileRevision: card.Data.ProfileRevision, token: a.token }
        a.contacts[card.Id] = contactData
        if err = contactData.UpdateContact(); err != nil {
          contactData.offsync = true
          PrintMsg(err)
        }
      }
    }
  } else {
    revision := strconv.FormatInt(a.revision.Card, 10)
    params := &TestApiParams{ query: "/cards?revision=" + revision, tokenType: APP_TOKENAPP, token: a.token }
    response := &TestApiResponse{ data: &cards }
    if err = TestApiRequest(GetCards, params, response); err != nil {
      return
    }
    for _, card := range cards {
      if card.Data == nil  {
        delete(a.contacts, card.Id)
      } else {
        contactData, set := a.contacts[card.Id]
        if !set {
          // download new card
          params := &TestApiParams{ query: "/cards/{cardId}", path: map[string]string{ "cardId": card.Id },
              tokenType: APP_TOKENAPP, token: a.token }
          response := &TestApiResponse{ data: &card }
          if err = TestApiRequest(GetCard, params, response); err != nil {
            return
          }
          contactData := &TestContactData{ card: card, articles: make(map[string]*Article), channels: make(map[string]*TestChannel),
            cardDetailRevision: card.Data.DetailRevision, cardProfileRevision: card.Data.ProfileRevision,
            profileRevision: card.Data.ProfileRevision, token: a.token }
          a.contacts[card.Id] = contactData
          if err = contactData.UpdateContact(); err != nil {
            contactData.offsync = true
            PrintMsg(err)
          }
        } else {
          // update existing card revisions 
          contactData.card.Data.NotifiedProfile = card.Data.NotifiedProfile
          contactData.card.Data.NotifiedArticle = card.Data.NotifiedArticle
          contactData.card.Data.NotifiedChannel = card.Data.NotifiedChannel
          contactData.card.Data.NotifiedView = card.Data.NotifiedView
          contactData.card.Data.DetailRevision = card.Data.DetailRevision
          contactData.card.Data.ProfileRevision = card.Data.ProfileRevision
          if err = contactData.UpdateContact(); err != nil {
            contactData.offsync = true
            PrintMsg(err)
          }
        }
      }
    }
  }
  return
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

  if rev.Group != a.revision.Group {
    if err := a.UpdateGroups(); err != nil {
      PrintMsg(err)
    } else {
      a.revision.Group = rev.Group
    }
  }

  if rev.Article != a.revision.Article {
    if err := a.UpdateArticles(); err != nil {
      PrintMsg(err)
    } else {
      a.revision.Article = rev.Article
    }
  }

  if rev.Card != a.revision.Card {
    if err := a.UpdateCards(); err != nil {
      PrintMsg(err)
    } else {
      a.revision.Card = rev.Card
    }
  }

  if rev.Channel != a.revision.Channel {
    if err := a.UpdateChannels(); err != nil {
      PrintMsg(err)
    } else {
      a.revision.Channel = rev.Channel
    }
  }

  if a.condition != nil {
    if a.condition.check(a) {
      select {
        case a.condition.channel <- true:
        default:
      }
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

/*** endpoint test function ***/

type TestApiParams struct {
  restType string
  path map[string]string
  query string
  body interface{}
  tokenType string
  token string
}

type TestApiResponse struct {
  code int
  data interface{}
  header map[string][]string
}

func TestApiRequest(endpoint func(http.ResponseWriter, *http.Request), params *TestApiParams, resp *TestApiResponse) (err error) {

  var r *http.Request
  var w *httptest.ResponseRecorder
  rest := params.restType
  if rest == "" {
    rest = "GET"
  }
  if r, w, err = NewRequest(rest, params.query, params.body); err != nil {
    return
  }
  r = mux.SetURLVars(r, params.path)
  if params.tokenType != "" {
    r.Header.Add("TokenType", params.tokenType)
  }
  if params.token != "" {
    SetBearerAuth(r, params.token)
  }
  endpoint(w, r)

  res := w.Result()
  if res.StatusCode != 200 && res.StatusCode != 410 {
    err = errors.New("response failed");
    return
  }
  resp.header = res.Header
  if resp.data != nil {
    dec := json.NewDecoder(res.Body)
    if err = dec.Decode(resp.data); err != nil {
      return
    }
  }
  return
}

