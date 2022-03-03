package store

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) {
  db.AutoMigrate(&Notification{});
  db.AutoMigrate(&Config{});
  db.AutoMigrate(&App{});
  db.AutoMigrate(&Account{});
  db.AutoMigrate(&AccountToken{});
  db.AutoMigrate(&GroupSlot{});
  db.AutoMigrate(&GroupData{});
  db.AutoMigrate(&Group{});
  db.AutoMigrate(&ChannelSlot{});
  db.AutoMigrate(&Channel{});
  db.AutoMigrate(&CardSlot{});
  db.AutoMigrate(&Card{});
  db.AutoMigrate(&ArticleSlot{});
  db.AutoMigrate(&Article{});
  db.AutoMigrate(&TopicSlot{});
  db.AutoMigrate(&Topic{});
  db.AutoMigrate(&Asset{});
  db.AutoMigrate(&TagSlot{});
  db.AutoMigrate(&Tag{});
}

type Notification struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  Node              string          `gorm:"not null"`
  Module            string          `gorm:"not null"`
  Token             string          `gorm:"not null"`
  Revision          int64           `gorm:"not null"`
}

type Config struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  ConfigId          string          `gorm:"not null;uniqueIndex"`
  StrValue          string
  NumValue          int64
  BoolValue         bool
  BinValue          []byte
}

type AccountToken struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AccountID         uint            `gorm:"index"`
  TokenType         string          `gorm:"not null;`
  Token             string          `gorm:"not null;uniqueIndex"`
  Expires           int64           `gorm:"not null"`
  Created           int64           `gorm:"autoCreateTime"`
  Account           Account
}

// NOTE: card & app reference account by guid, all other tables by id
//  because token lookup uses guid and is most common and wanted to avoid join
//  int foreign key should be faster, so left other tables with id reference
type Account struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AccountDetailID   uint            `gorm:"not null"`
  Guid              string          `gorm:"not null;uniqueIndex"`
  Username          string          `gorm:"not null;uniqueIndex"`
  Password          []byte          `gorm:"not null"`
  ProfileRevision   int64           `gorm:"not null;default:1"`
  ArticleRevision   int64           `gorm:"not null;default:1"`
  GroupRevision     int64           `gorm:"not null;default:1"`
  ChannelRevision   int64           `gorm:"not null;default:1"`
  CardRevision      int64           `gorm:"not null;default:1"`
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Disabled          bool            `gorm:"not null;default:false"`
  AccountDetail     AccountDetail
  Apps              []App
}

type AccountDetail struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  PublicKey         string          `gorm:"not null"`
  PrivateKey        string          `gorm:"not null"`
  KeyType           string          `gorm:"not null"`
  Name              string
  Description       string
  Location          string
  Image             string
}

type App struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AccountID         string          `gorm:"not null;index:appguid,unique"`
  Name              string
  Description       string
  Image             string
  Url               string
  Token             string          `gorm:"not null;index:appguid,unique"`
  Created           int64           `gorm:"autoCreateTime"`
  Account           Account         `gorm:"references:Guid"`
}

type GroupSlot struct {
  ID                uint
  GroupSlotId       string          `gorm:"not null;index:groupslot,unique"`
  AccountID         uint            `gorm:"not null;index:groupslot,unique"`
  Revision          int64           `gorm:"not null"`
  GroupID           uint            `gorm:"not null;default:0"`
  Group             *Group
  Account           Account
}

type Group struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  GroupDataID       uint            `gorm:"not null;index:groupdata"`
  DataType          string          `gorm:"index"`
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Cards             []Card          `gorm:"many2many:card_groups"`
  Channels          []Channel       `gorm:"many2many:channel_groups"`
  Articles          []Article       `gorm:"many2many:article_groups"`
  GroupData         GroupData
  GroupSlot         GroupSlot
}

type GroupData struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  Data              string
}

type CardSlot struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  CardSlotId        string          `gorm:"not null;index:cardslot,unique"`
  AccountID         uint            `gorm:"not null;index:cardslot,unique"`
  Revision          int64           `gorm:"not null"`
  CardID            uint            `gorm:"not null;default:0"`
  Card              *Card
  Account           Account
}

type Card struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AccountID         string          `gorm:"not null;index:cardguid,unique"`
  Guid              string          `gorm:"not null;index:cardguid,unique"`
  Username          string
  Name              string
  Description       string
  Location          string
  Image             string
  Version           string          `gorm:"not null"`
  Node              string          `gorm:"not null"`
  ProfileRevision   int64           `gorm:"not null"`
  DetailRevision    int64           `gorm:"not null;default:1"`
  Status            string          `gorm:"not null"`
  InToken           string          `gorm:"not null;index:cardguid,unique"`
  OutToken          string
  Notes             string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  ViewRevision      int64           `gorm:"not null;default:1"`
  NotifiedView      int64
  NotifiedArticle   int64
  NotifiedChannel   int64
  NotifiedProfile   int64
  Account           Account         `gorm:"references:Guid"`
  Groups            []Group         `gorm:"many2many:card_groups"`
  Channels          []Channel       `gorm:"many2many:channel_cards"`
  CardSlot          CardSlot
}

type ArticleSlot struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  ArticleSlotId     string          `gorm:"not null;index:articleslot,unique"`
  AccountID         uint            `gorm:"not null;index:articleslot,unique"`
  Revision          int64           `gorm:"not null"`
  ArticleID         uint            `gorm:"not null;default:0"`
  Article           *Article
  Account           Account
}

type Article struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Groups            []Group         `gorm:"many2many:article_groups;"`
  ArticleSlot       ArticleSlot
}

type ChannelSlot struct {
  ID                uint
  ChannelSlotId     string          `gorm:"not null;index:channelslot,unique"`
  AccountID         uint            `gorm:"not null;index:channelslot,unique"`
  Revision          int64           `gorm:"not null"`
  ChannelID         uint            `gorm:"not null;default:0"`
  Channel           *Channel
  Account           Account
}

type Channel struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  DetailRevision    int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Groups            []Group         `gorm:"many2many:channel_groups;"`
  Cards             []Card          `gorm:"many2many:channel_cards;"`
  Topics            []Topic
  ChannelSlot       ChannelSlot
}

type TopicSlot struct {
  ID                uint
  TopicSlotId       string          `gorm:"not null;index:topicaccount,unique;index:topicchannel,unique"`
  AccountID         uint            `gorm:"not null;index:topicaccount,unique"`
  ChannelID         uint            `gorm:"not null;index:topicchannel,unique"`
  Revision          int64           `gorm:"not null"`
  Topic             *Topic
  Channel           *Channel
  Account           Account
}

type Topic struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  DetailRevision    int64           `gorm:"not null"`
  ChannelID         uint
  TopicSlotID       uint            `gorm:"not null;index:topictopicslot,unique"`
  Guid              string
  DataType          string          `gorm:"index"`
  Data              string
  Status            string          `gorm:"not null;index"`
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  TagCount          int32           `gorm:"not null"`
  TagUpdated        int64
  TagRevision       int64           `gorm:"not null"`
  Channel           *Channel
  Assets            []Asset
  Tags              []Tag
  TopicSlot         TopicSlot
}

type Asset struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AssetId           string          `gorm:"not null;index:asset,unique"`
  AccountID         uint            `gorm:"not null;index:asset,unique"`
  ChannelID         uint
  TopicID           uint
  Status            string          `gorm:"not null;index"`
  Size              int64
  Crc               uint32
  Transform         string
  TransformId       string
  TransformParams   string
  TransformQueue    string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Account           Account
  Channel           *Channel
  Topic             *Topic
}

type TagSlot struct {
  ID                uint
  TagSlotId         string          `gorm:"not null;index:tagslot,unique"`
  AccountID         uint            `gorm:"not null;index:tagslot,unique"`
  TopicID           uint            `gorm:"not null;index:tagtopic"`
  Revision          int64           `gorm:"not null"`
  Tag               *Tag
  Account           Account
  Topic             *Topic
}

type Tag struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  TagSlotID         uint            `gorm:"not null;index:tagtagslot,unique"`
  ChannelID         uint            `gorm:"not null;index:channeltag"`
  TopicID           uint            `gorm:"not null;index:topictag"`
  Guid              string          `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Channel           *Channel
  Topic             *Topic
  TagSlot           TagSlot
}


