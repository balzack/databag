package databag

import (
  "time"
  "errors"
  "strings"
  "strconv"
  "sync"
  "encoding/json"
  "net/http"
  "net/http/httptest"
  "github.com/gorilla/websocket"
  "github.com/gorilla/mux"
)

const testTimeout = 5

type TestCondition struct {
  check func(*TestApp) bool
  channel chan bool
}

type TestTopic struct {
  topic Topic
  tags map[string]*Tag
}

type TestChannel struct {
  channel Channel
  topics map[string]*TestTopic
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
  if c.card.Data.CardDetail.Status != APPCardConnected {
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
  token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
  params := &TestAPIParams{ query: "/profile/message", tokenType: APPTokenContact, token: token }
  response := &TestAPIResponse{ data: &msg }
  if err = TestAPIRequest(GetProfileMessage, params, response); err != nil {
    return
  }
  params = &TestAPIParams{ restType: "PUT", query: "/contact/cards/{cardID}/profile", tokenType: APPTokenAgent, token: c.token,
    path: map[string]string{ "cardID": c.card.ID }, body: &msg }
  response = &TestAPIResponse{}
  if err = TestAPIRequest(SetCardProfile, params, response); err != nil {
    return
  }
  return
}

func (c *TestContactData) UpdateContactArticle() (err error) {
  var articles []Article
  if c.articleRevision == 0 || c.viewRevision != c.card.Data.NotifiedView {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    params := &TestAPIParams{ query: "/articles", tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &articles }
    if err = TestAPIRequest(GetArticles, params, response); err != nil {
      return
    }
    c.articles = make(map[string]*Article)
  } else {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    viewRevision := strconv.FormatInt(c.viewRevision, 10)
    articleRevision := strconv.FormatInt(c.articleRevision, 10)
    params := &TestAPIParams{ query: "/articles?articleRevision=" + articleRevision + "&viewRevision=" + viewRevision,
        tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &articles }
    if err = TestAPIRequest(GetArticles, params, response); err != nil {
      return
    }
  }
  for _, article := range articles {
    if article.Data == nil  {
      delete(c.articles, article.ID)
    } else {
      c.articles[article.ID] = &article
    }
  }
  return nil
}

func (c *TestContactData) UpdateContactChannels() (err error) {
  var channels []Channel
  if c.channelRevision == 0 || c.viewRevision != c.card.Data.NotifiedView {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    params := &TestAPIParams{ query: "/channels", tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &channels }
    if err = TestAPIRequest(GetChannels, params, response); err != nil {
      return
    }
  } else {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    viewRevision := strconv.FormatInt(c.viewRevision, 10)
    channelRevision := strconv.FormatInt(c.channelRevision, 10)
    params := &TestAPIParams{ query: "/channels?channelRevision=" + channelRevision + "&viewRevision=" + viewRevision,
        tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &channels }
    if err = TestAPIRequest(GetChannels, params, response); err != nil {
      return
    }
  }

  for _, channel := range channels {
    if channel.Data == nil {
      delete(c.channels, channel.ID)
    } else {
      tc, set := c.channels[channel.ID]
      if set {
        if channel.Revision != tc.channel.Revision {
          if err = c.UpdateContactChannel(tc, &channel); err != nil {
            return
          }
          tc.channel.Revision = channel.Revision
        }
      } else {
        tc := &TestChannel{ channel: Channel{ ID: channel.ID, Data: &ChannelData{} } }
        c.channels[channel.ID] = tc
        if err = c.UpdateContactChannel(tc, &channel); err != nil {
          return
        }
        tc.channel.Revision = channel.Revision
      }
    }
  }
  return
}

func (c *TestContactData) UpdateContactChannel(storeChannel *TestChannel, channel *Channel) (err error) {
  if storeChannel.channel.Revision != channel.Revision {
    if storeChannel.channel.Data.TopicRevision != channel.Data.TopicRevision {
      if err = c.UpdateContactChannelTopics(storeChannel); err != nil {
        return
      }
      storeChannel.channel.Data.TopicRevision = channel.Data.TopicRevision
    }
    if channel.Data.ChannelDetail != nil {
      storeChannel.channel.Data.ChannelDetail = channel.Data.ChannelDetail
      storeChannel.channel.Data.DetailRevision = channel.Data.DetailRevision
    } else if storeChannel.channel.Data.DetailRevision != channel.Data.DetailRevision {
      token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
      params := &TestAPIParams{ query: "/channel/{channelID}", path: map[string]string{ "channelID": channel.ID },
          tokenType: APPTokenContact, token: token }
      detail := &ChannelDetail{}
      response := &TestAPIResponse{ data: &detail }
      if err = TestAPIRequest(GetChannelDetail, params, response); err != nil {
        return
      }
      if channel.Data == nil {
        err = errors.New("channel removed during update")
        return
      }
      storeChannel.channel.Data.ChannelDetail = detail
      storeChannel.channel.Data.DetailRevision = channel.Data.DetailRevision
    }
  }
  return
}

func (c *TestContactData) UpdateContactChannelTopics(storeChannel *TestChannel) (err error) {
  var topics []Topic
  if storeChannel.channel.Revision == 0 {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    params := &TestAPIParams{ query: "/channels/{channelID}/topics",
      path: map[string]string{ "channelID": storeChannel.channel.ID }, tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &topics }
    if err = TestAPIRequest(GetChannelTopics, params, response); err != nil {
      return
    }
    storeChannel.topics = make(map[string]*TestTopic)
  } else {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    revision := strconv.FormatInt(storeChannel.channel.Revision, 10)
    params := &TestAPIParams{ query: "/channels/{channelID}/topics?revision=" + revision,
        path: map[string]string{ "channelID": storeChannel.channel.ID }, tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &topics }
    if err = TestAPIRequest(GetChannelTopics, params, response); err != nil {
      return
    }
  }

  for _, topic := range topics {
    if topic.Data == nil {
      delete(storeChannel.topics, topic.ID)
    } else {
      storeTopic, set := storeChannel.topics[topic.ID]
      if set {
        if topic.Revision != storeTopic.topic.Revision {
          if err = c.UpdateContactChannelTopic(storeChannel, storeTopic, &topic); err != nil {
            return
          }
          storeTopic.topic.Revision = topic.Revision
        }
      } else {
        storeTopic := &TestTopic{ topic: Topic{ ID: topic.ID, Data: &TopicData{} } }
        storeChannel.topics[topic.ID] = storeTopic
        if err = c.UpdateContactChannelTopic(storeChannel, storeTopic, &topic); err != nil {
          return
        }
        storeTopic.topic.Revision = topic.Revision
      }
    }
  }
  return
}

func (c *TestContactData) UpdateContactChannelTopic(storeChannel *TestChannel, storeTopic *TestTopic, topic *Topic) (err error) {
  if storeTopic.topic.Revision != topic.Revision {
    if storeTopic.topic.Data.TagRevision != topic.Data.TagRevision {
      if err = c.UpdateContactChannelTopicTags(storeChannel, storeTopic); err != nil {
        return
      }
      storeTopic.topic.Data.TagRevision = topic.Data.TagRevision
    }
    if topic.Data.TopicDetail != nil {
      storeTopic.topic.Data.TopicDetail = topic.Data.TopicDetail
      storeTopic.topic.Data.DetailRevision = topic.Data.DetailRevision
    } else if storeTopic.topic.Data.DetailRevision != topic.Data.DetailRevision {
      token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
      params := &TestAPIParams{ query: "/channels/{channelID}/topics/{topicID}",
          path: map[string]string{ "channelID": storeChannel.channel.ID, "topicID": topic.ID },
          tokenType: APPTokenContact, token: token }
      topic := Topic{}
      response := &TestAPIResponse{ data: &topic }
      if err = TestAPIRequest(GetChannelTopic, params, response); err != nil {
        return
      }
      if topic.Data == nil {
        err = errors.New("topic removed during update")
        return
      }
      storeTopic.topic.Data.TopicDetail = topic.Data.TopicDetail
      storeTopic.topic.Data.DetailRevision = topic.Data.DetailRevision
    }
  }
  return
}

func (c *TestContactData) UpdateContactChannelTopicTags(storeChannel *TestChannel, storeTopic *TestTopic) (err error) {
  var tags []Tag
  if storeTopic.topic.Revision == 0 {
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    params := &TestAPIParams{ query: "/channels/{channelID}/topics/{topicID}/tags",
      path: map[string]string{ "channelID": storeChannel.channel.ID, "topicID": storeTopic.topic.ID },
      tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &tags }
    if err = TestAPIRequest(GetChannelTopicTags, params, response); err != nil {
      return
    }
    storeTopic.tags = make(map[string]*Tag)
  } else {
    revision := strconv.FormatInt(storeTopic.topic.Revision, 10)
    token := c.card.Data.CardProfile.GUID + "." + c.card.Data.CardDetail.Token
    params := &TestAPIParams{ query: "/channels/{channelID}/topics/{topicID}/tags?revision=" + revision,
        path: map[string]string{ "channelID": storeChannel.channel.ID, "topicID": storeTopic.topic.ID },
        tokenType: APPTokenContact, token: token }
    response := &TestAPIResponse{ data: &tags }
    if err = TestAPIRequest(GetChannelTopicTags, params, response); err != nil {
      return
    }
  }

  for _, tag := range tags {
    if tag.Data == nil {
      delete(storeTopic.tags, tag.ID)
    } else {
      storeTopic.tags[tag.ID] = &tag
    }
  }
  return
}

func (c *TestContactData) UpdateContactCardDetail() (err error) {
  var cardDetail CardDetail
  params := &TestAPIParams{ query: "/contact/cards/{cardID}/detail", tokenType: APPTokenAgent, token: c.token,
    path: map[string]string{ "cardID": c.card.ID } }
  response := &TestAPIResponse{ data: &cardDetail }
  if err = TestAPIRequest(GetCardDetail, params, response); err != nil {
    return
  }
  c.card.Data.CardDetail = &cardDetail
  return
}

func (c *TestContactData) UpdateContactCardProfile() (err error) {
  var cardProfile CardProfile
  params := &TestAPIParams{ query: "/contact/cards/{cardID}/profile", tokenType: APPTokenAgent, token: c.token,
    path: map[string]string{ "cardID": c.card.ID } }
  response := &TestAPIResponse{ data: &cardProfile }
  if err = TestAPIRequest(GetCardProfile, params, response); err != nil {
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
  params := &TestAPIParams{ query: "/profile", tokenType: APPTokenAgent, token: a.token }
  response := &TestAPIResponse{ data: &a.profile }
  err = TestAPIRequest(GetProfile, params, response)
  return
}

func (a *TestApp) UpdateGroups() (err error) {
  var groups []Group
  if a.revision.Group == 0 {
    params := &TestAPIParams{ query: "/groups", tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &groups }
    if err = TestAPIRequest(GetGroups, params, response); err != nil {
      return
    }
  } else {
    revision := strconv.FormatInt(a.revision.Group, 10)
    params := &TestAPIParams{ query: "/groups?revision=" + revision, tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &groups }
    if err = TestAPIRequest(GetGroups, params, response); err != nil {
      return
    }
  }
  for _, group := range groups {
    if group.Data == nil  {
      delete(a.groups, group.ID)
    } else {
      a.groups[group.ID] = &group
    }
  }
  return
}

func (a *TestApp) UpdateArticles() (err error) {
  var articles []Article
  if a.revision.Article == 0 {
    params := &TestAPIParams{ query: "/articles", tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &articles }
    if err = TestAPIRequest(GetArticles, params, response); err != nil {
      return
    }
  } else {
    revision := strconv.FormatInt(a.revision.Article, 10)
    params := &TestAPIParams{ query: "/articles?articleRevision=" + revision, tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &articles }
    if err = TestAPIRequest(GetArticles, params, response); err != nil {
      return
    }
  }
  for _, article := range articles {
    if article.Data == nil  {
      delete(a.articles, article.ID)
    } else {
      a.articles[article.ID] = &article
    }
  }
  return
}

func (a *TestApp) UpdateChannels() (err error) {
  var channels []Channel
  if a.revision.Channel == 0 {
    params := &TestAPIParams{ query: "/channels", tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &channels }
    if err = TestAPIRequest(GetChannels, params, response); err != nil {
      return
    }
  } else {
    revision := strconv.FormatInt(a.revision.Channel, 10)
    params := &TestAPIParams{ query: "/channels?channelRevision=" + revision, tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &channels }
    if err = TestAPIRequest(GetChannels, params, response); err != nil {
      return
    }
  }

  for _, channel := range channels {
    if channel.Data == nil {
      delete(a.channels, channel.ID)
    } else {
      storeChannel, set := a.channels[channel.ID]
      if set {
        if channel.Revision != storeChannel.channel.Revision {
          if err = a.UpdateChannel(storeChannel, &channel); err != nil {
            return
          }
          storeChannel.channel.Revision = channel.Revision
        }
      } else {
        storeChannel := &TestChannel{ channel: Channel{ ID: channel.ID, Data: &ChannelData{} } }
        a.channels[channel.ID] = storeChannel
        if err = a.UpdateChannel(storeChannel, &channel); err != nil {
          return
        }
        storeChannel.channel.Revision = channel.Revision
      }
    }
  }
  return
}

func (a *TestApp) UpdateChannel(storeChannel *TestChannel, channel *Channel) (err error) {
  if storeChannel.channel.Revision != channel.Revision {
    if storeChannel.channel.Data.TopicRevision != channel.Data.TopicRevision {
      if err = a.UpdateChannelTopics(storeChannel); err != nil {
        return
      }
      storeChannel.channel.Data.TopicRevision = channel.Data.TopicRevision
    }
    if channel.Data.ChannelDetail != nil {
      storeChannel.channel.Data.ChannelDetail = channel.Data.ChannelDetail
      storeChannel.channel.Data.DetailRevision = channel.Data.DetailRevision
    } else if storeChannel.channel.Data.DetailRevision != channel.Data.DetailRevision {
      params := &TestAPIParams{ query: "/channel/{channelID}", path: map[string]string{ "channelID": channel.ID },
          tokenType: APPTokenAgent, token: a.token }
      detail := &ChannelDetail{}
      response := &TestAPIResponse{ data: &detail }
      if err = TestAPIRequest(GetChannelDetail, params, response); err != nil {
        return
      }
      if channel.Data == nil {
        err = errors.New("channel removed during update")
        return
      }
      storeChannel.channel.Data.ChannelDetail = detail
      storeChannel.channel.Data.DetailRevision = channel.Data.DetailRevision
    }
  }
  return
}

func (a *TestApp) UpdateChannelTopics(storeChannel *TestChannel) (err error) {
  var topics []Topic
  if storeChannel.channel.Revision == 0 {
    params := &TestAPIParams{ query: "/channels/{channelID}/topics",
      path: map[string]string{ "channelID": storeChannel.channel.ID }, tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &topics }
    if err = TestAPIRequest(GetChannelTopics, params, response); err != nil {
      return
    }
    storeChannel.topics = make(map[string]*TestTopic)
  } else {
    revision := strconv.FormatInt(storeChannel.channel.Revision, 10)
    params := &TestAPIParams{ query: "/channels/{channelID}/topics?revision=" + revision,
        path: map[string]string{ "channelID": storeChannel.channel.ID }, tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &topics }
    if err = TestAPIRequest(GetChannelTopics, params, response); err != nil {
      return
    }
  }

  for _, topic := range topics {
    if topic.Data == nil {
      delete(storeChannel.topics, topic.ID)
    } else {
      storeTopic, set := storeChannel.topics[topic.ID]
      if set {
        if topic.Revision != storeTopic.topic.Revision {
          if err = a.UpdateChannelTopic(storeChannel, storeTopic, &topic); err != nil {
            return
          }
          storeTopic.topic.Revision = topic.Revision
        }
      } else {
        storeTopic := &TestTopic{ topic: Topic{ ID: topic.ID, Data: &TopicData{} } }
        storeChannel.topics[topic.ID] = storeTopic
        if err = a.UpdateChannelTopic(storeChannel, storeTopic, &topic); err != nil {
          return
        }
        storeTopic.topic.Revision = topic.Revision
      }
    }
  }
  return
}

func (a *TestApp) UpdateChannelTopic(storeChannel *TestChannel, storeTopic *TestTopic, topic *Topic) (err error) {
  if storeTopic.topic.Revision != topic.Revision {
    if storeTopic.topic.Data.TagRevision != topic.Data.TagRevision {
      if err = a.UpdateChannelTopicTags(storeChannel, storeTopic); err != nil {
        return
      }
      storeTopic.topic.Data.TagRevision = topic.Data.TagRevision
    }
    if topic.Data.TopicDetail != nil {
      storeTopic.topic.Data.TopicDetail = topic.Data.TopicDetail
      storeTopic.topic.Data.DetailRevision = topic.Data.DetailRevision
    } else if storeTopic.topic.Data.DetailRevision != topic.Data.DetailRevision {
      params := &TestAPIParams{ query: "/channels/{channelID}/topics/{topicID}",
          path: map[string]string{ "channelID": storeChannel.channel.ID, "topicID": topic.ID },
          tokenType: APPTokenAgent, token: a.token }
      topic := Topic{}
      response := &TestAPIResponse{ data: &topic }
      if err = TestAPIRequest(GetChannelTopic, params, response); err != nil {
        return
      }
      if topic.Data == nil {
        err = errors.New("topic removed during update")
        return
      }
      storeTopic.topic.Data.TopicDetail = topic.Data.TopicDetail
      storeTopic.topic.Data.DetailRevision = topic.Data.DetailRevision
    }
  }
  return
}

func (a *TestApp) UpdateChannelTopicTags(storeChannel *TestChannel, storeTopic *TestTopic) (err error) {
  var tags []Tag
  if storeTopic.topic.Revision == 0 {
    params := &TestAPIParams{ query: "/channels/{channelID}/topics/{topicID}/tags",
      path: map[string]string{ "channelID": storeChannel.channel.ID, "topicID": storeTopic.topic.ID },
      tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &tags }
    if err = TestAPIRequest(GetChannelTopicTags, params, response); err != nil {
      return
    }
    storeTopic.tags = make(map[string]*Tag)
  } else {
    revision := strconv.FormatInt(storeTopic.topic.Revision, 10)
    params := &TestAPIParams{ query: "/channels/{channelID}/topics/{topicID}/tags?revision=" + revision,
        path: map[string]string{ "channelID": storeChannel.channel.ID, "topicID": storeTopic.topic.ID },
        tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &tags }
    if err = TestAPIRequest(GetChannelTopicTags, params, response); err != nil {
      return
    }
  }

  for _, tag := range tags {
    if tag.Data == nil {
      delete(storeTopic.tags, tag.ID)
    } else {
      storeTopic.tags[tag.ID] = &tag
    }
  }
  return
}

func (a *TestApp) UpdateCards() (err error) {
  var cards []Card
  if a.revision.Card == 0 {
    params := &TestAPIParams{ query: "/cards", tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &cards }
    if err = TestAPIRequest(GetCards, params, response); err != nil {
      return
    }
    for _, card := range cards {
      if card.Data == nil  {
        delete(a.contacts, card.ID)
      } else {
        // set new card
        contactData := &TestContactData{ card: card, articles: make(map[string]*Article), channels: make(map[string]*TestChannel),
            cardDetailRevision: card.Data.DetailRevision, cardProfileRevision: card.Data.ProfileRevision,
            profileRevision: card.Data.ProfileRevision, token: a.token }
        a.contacts[card.ID] = contactData
        if err = contactData.UpdateContact(); err != nil {
          contactData.offsync = true
          PrintMsg(err)
        }
      }
    }
  } else {
    revision := strconv.FormatInt(a.revision.Card, 10)
    params := &TestAPIParams{ query: "/cards?revision=" + revision, tokenType: APPTokenAgent, token: a.token }
    response := &TestAPIResponse{ data: &cards }
    if err = TestAPIRequest(GetCards, params, response); err != nil {
      return
    }
    for _, card := range cards {
      if card.Data == nil  {
        delete(a.contacts, card.ID)
      } else {
        contactData, set := a.contacts[card.ID]
        if !set {
          // download new card
          params := &TestAPIParams{ query: "/cards/{cardID}", path: map[string]string{ "cardID": card.ID },
              tokenType: APPTokenAgent, token: a.token }
          response := &TestAPIResponse{ data: &card }
          if err = TestAPIRequest(GetCard, params, response); err != nil {
            return
          }
          contactData := &TestContactData{ card: card, articles: make(map[string]*Article), channels: make(map[string]*TestChannel),
            cardDetailRevision: card.Data.DetailRevision, cardProfileRevision: card.Data.ProfileRevision,
            profileRevision: card.Data.ProfileRevision, token: a.token }
          a.contacts[card.ID] = contactData
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
    time.Sleep(testTimeout * time.Second)
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

type TestAPIParams struct {
  restType string
  path map[string]string
  query string
  body interface{}
  tokenType string
  token string
  authorization string
  credentials string
}

type TestAPIResponse struct {
  code int
  data interface{}
  header map[string][]string
}

func TestAPIRequest(endpoint func(http.ResponseWriter, *http.Request), params *TestAPIParams, resp *TestAPIResponse) (err error) {

  var r *http.Request
  var w *httptest.ResponseRecorder
  rest := params.restType
  if rest == "" {
    rest = "GET"
  }

  if params.tokenType == APPTokenAgent {
    if !strings.Contains(params.query, "?") {
      params.query += "?"
    } else {
      params.query += "&"
    }
    params.query += "agent=" + params.token
  } else if params.tokenType == APPTokenContact {
    if !strings.Contains(params.query, "?") {
      params.query += "?"
    } else {
      params.query += "&"
    }
    params.query += "contact=" + params.token
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

  if params.authorization != "" {
    SetBasicAuth(r, params.authorization)
  }
  if params.credentials != "" {
    SetCredentials(r, params.credentials)
  }

  endpoint(w, r)

  res := w.Result()
  if res.StatusCode != 200 && res.StatusCode != 410 {
    err = errors.New("response failed");
    return
  }
  if resp != nil {
    resp.header = res.Header
    if resp.data != nil {
      dec := json.NewDecoder(res.Body)
      if err = dec.Decode(resp.data); err != nil {
        return
      }
    }
  }
  return
}

