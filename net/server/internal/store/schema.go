package store

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) {
  db.AutoMigrate(&Notification{});
  db.AutoMigrate(&Config{});
  db.AutoMigrate(&App{});
  db.AutoMigrate(&Account{});
  db.AutoMigrate(&AccountToken{});
  db.AutoMigrate(&Group{});
  db.AutoMigrate(&Label{});
  db.AutoMigrate(&Card{});
  db.AutoMigrate(&Asset{});
  db.AutoMigrate(&Article{});
  db.AutoMigrate(&ArticleBlock{});
  db.AutoMigrate(&ArticleAsset{});
  db.AutoMigrate(&ArticleTag{});
  db.AutoMigrate(&Dialogue{});
  db.AutoMigrate(&Insight{});
  db.AutoMigrate(&Topic{});
  db.AutoMigrate(&TopicAsset{});
  db.AutoMigrate(&TopicTag{});
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
  ContentRevision   int64           `gorm:"not null;default:1"`
  GroupRevision     int64           `gorm:"not null;default:1"`
  LabelRevision     int64           `gorm:"not null;default:1"`
  CardRevision      int64           `gorm:"not null;default:1"`
  DialogueRevision  int64           `gorm:"not null;default:1"`
  InsightRevision   int64           `gorm:"not null;default:1"`
  ViewRevision      int64           `gorm:"not null;default:1"`
  Created           int64           `gorm:"autoCreateTime"`
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

type Group struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  GroupId           string          `gorm:"not null;index:group,unqiue"`
  AccountID         uint            `gorm:"not null;index:group,unique"`
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Account           Account
}

type Label struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  LabelId           string          `gorm:"not null;index:label,unique"`
  AccountID         uint            `gorm:"not null;index:label,unique"`
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Groups            []Group         `gorm:"many2many:label_groups;"`
  Account           Account
}

type Card struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  CardId            string          `gorm:"not null;index:card,unique"`
  AccountID         string          `gorm:"not null;index:card,unique"`
  Guid              string          `gorm:"not null;index:cardguid,unique"`
  Username          string
  Name              string
  Description       string
  Location          string
  Image             string
  Version           string          `gorm:"not null"`
  Node              string          `gorm:"not null"`
  ProfileRevision   int64           `gorm:"not null"`
  Status            string          `gorm:"not null"`
  InToken           string          `gorm:"not null;index:cardguid,unique"`
  OutToken          string
  Notes             string
  DataRevision      int64           `gorm:"not null"`
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  ViewRevision      int64           `gorm:"not null"`
  NotifiedView      int64
  NotifiedContent   int64
  NotifiedProfile   int64
  Groups            []Group         `gorm:"many2many:card_groups;"`
  Account           Account         `gorm:"references:Guid"`
}

type Asset struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AssetId           string          `gorm:"not null;index:asset,unique"`
  AccountID         uint            `gorm:"not null;index:asset,unique"`
  Status            string          `gorm:"not null;index"`
  Size              uint64
  Crc               uint32
  Transform         string
  TransformId       string
  TransformData     string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Account           Account
}

type ArticleBlock struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  ArticleBlockId    string          `gorm:"not null;index:articleblock,unique"`
  AccountID         uint            `gorm:"not null;index:articleblock,unique"`
  Revision          int64           `gorm:"not null"`
  Articles          []Article
}

type Article struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  ArticleId         string          `gorm:"not null;index:article,unique"`
  AccountID         uint            `gorm:"not null;index:article,unique"`
  ArticleBlockID    uint            `gorm:"not null;index:articleblock"`
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Status            string          `gorm:"not null;index"`
  Expires           int64
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  TagUpdated        int64           `gorm:"not null"`
  TagRevision       int64           `gorm:"not null"`
  Groups            []Group         `gorm:"many2many:article_groups;"`
  Labels            []Label         `gorm:"many2many:article_labels;"`
  Account           Account
}

type ArticleAsset struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AssetID           uint
  ArticleID         uint
  Article           Article
  Asset             Asset
}

type ArticleTag struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  TagId             string          `gorm:"not null;index:articletag,unique"`
  ArticleID         uint            `gorm:"not null;index:articletag,unique"`
  CardID            uint
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Article           Article
  Card              Card
}

type Dialogue struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  DialogueId        string          `gorm:"not null;index:dialogue,unique"`
  AccountID         uint            `gorm:"not null;index:dialogue,unique"`
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Active            bool            `gorm:"not null"`
  MemberRevision    uint64          `gorm:"not null"`
  TopicUpdated      int64
  TopicRevision     uint64          `gorm:"not null"`
  Cards             []Card          `gorm:"many2many:dialog_cards;"`
  Account           Account
}

type Insight struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  InsightId         string          `gorm:"not null;index:insight,unique"`
  CardID            uint            `gorm:"not null;index:insight,unique"`
  dialogueRevision  uint64          `gorm:"not null"`
  memberRevision    uint64          `gorm:"not null"`
  topicRevision     uint64          `gorm:"not null"`
  Card              Card
}

type Topic struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  TopicId           string          `gorm:"not null;index:topic,unique"`
  AccountID         uint            `gorm:"not null;index:topic,unique"`
  CardID            uint
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Status            string          `gorm:"not null;index"`
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  TagUpdated        int64           `gorm:"not null"`
  TagRevision       uint64          `gorm:"not null"`
  Account           Account
  Card              Card
}

type TopicAsset struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  AssetID           uint
  TopicID           uint
  Topic             Topic
  Asset             Asset
}

type TopicTag struct {
  ID                uint            `gorm:"primaryKey;not null;unique;autoIncrement"`
  TagId             string          `gorm:"not null;index:topictag,unique"`
  TopicID           uint            `gorm:"not null;index:topictag,unique"`
  CardID            uint
  Revision          int64           `gorm:"not null"`
  DataType          string          `gorm:"index"`
  Data              string
  Created           int64           `gorm:"autoCreateTime"`
  Updated           int64           `gorm:"autoUpdateTime"`
  Topic             Topic
  Card              Card
}


