--
-- File generated with SQLiteStudio v3.3.3 on Sun Jan 9 20:58:42 2022
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: account
CREATE TABLE account (
    id               INTEGER        PRIMARY KEY
                                    UNIQUE
                                    NOT NULL,
    did              BLOB           NOT NULL,
    username         VARCHAR (64)   UNIQUE
                                    NOT NULL,
    password         VARCHAR (256)  NOT NULL,
    salt             VARCHAR (256)  NOT NULL,
    name             VARCHAR (64),
    description      VARCHAR (4096),
    location         VARCHAR (64),
    image            BLOB,
    profileRevision  INTEGER (8)    NOT NULL
                                    DEFAULT (0),
    contentRevision  INTEGER (8)    NOT NULL
                                    DEFAULT (0),
    viewRevision     INTEGER (8)    DEFAULT (0) 
                                    NOT NULL,
    groupRevision    INTEGER (8)    DEFAULT (0) 
                                    NOT NULL,
    labelRevision    INTEGER (8)    DEFAULT (0) 
                                    NOT NULL,
    cardRevision     INTEGER (8)    DEFAULT (0) 
                                    NOT NULL,
    dialogueRevision INTEGER (8)    DEFAULT (0) 
                                    NOT NULL,
    insightRevision  INTEGER (8)    DEFAULT (0) 
                                    NOT NULL
);


-- Table: accountApp
CREATE TABLE accountApp (
    id        INTEGER   PRIMARY KEY
                        NOT NULL
                        UNIQUE,
    accountId INTEGER   REFERENCES account (id) 
                        NOT NULL,
    appId     INTEGER   REFERENCES app (id) 
                        NOT NULL,
    token     BLOB (64) UNIQUE
                        NOT NULL
);


-- Table: app
CREATE TABLE app (
    id          INTEGER        PRIMARY KEY
                               NOT NULL
                               UNIQUE,
    name        VARCHAR (64)   NOT NULL,
    description VARCHAR (4096),
    image       BLOB,
    url         VARCHAR (1024) 
);


-- Table: article
CREATE TABLE article (
    id              INTEGER      PRIMARY KEY
                                 NOT NULL
                                 UNIQUE,
    accountId       INTEGER      REFERENCES account (id) 
                                 NOT NULL,
    articleId       VARCHAR (16),
    status          VARCHAR (16) NOT NULL,
    subjectRevision INTEGER (8)  NOT NULL,
    type            VARCHAR (16),
    data            BLOB,
    created         INTEGER (4)  NOT NULL,
    modified        INTEGER (4)  NOT NULL,
    tagUpdated      INTEGER (4)  NOT NULL,
    tagRevision     INTEGER (8)  NOT NULL,
    UNIQUE (
        accountId,
        articleId
    )
);


-- Table: articleAsset
CREATE TABLE articleAsset (
    id            INTEGER      PRIMARY KEY
                               UNIQUE
                               NOT NULL,
    articleId     INTEGER      REFERENCES article (id),
    assetId       VARCHAR (16) NOT NULL,
    originalId    INTEGER      REFERENCES articleAsset (id),
    status        VARCHAR (16) NOT NULL,
    size          INTEGER (8),
    crc           INTEGER (8),
    transform     VARCHAR (16),
    transformData BLOB,
    UNIQUE (
        articleId,
        assetId
    )
);


-- Table: articleGroup
CREATE TABLE articleGroup (
    id        INTEGER PRIMARY KEY
                      UNIQUE
                      NOT NULL,
    articleId INTEGER REFERENCES article (id),
    groupId   INTEGER REFERENCES [group] (id) 
);


-- Table: articleLabel
CREATE TABLE articleLabel (
    id        INTEGER PRIMARY KEY
                      NOT NULL
                      UNIQUE,
    articleId INTEGER REFERENCES article (id),
    labelId   INTEGER REFERENCES label (id) 
);


-- Table: articleTag
CREATE TABLE articleTag (
    id        INTEGER      NOT NULL
                           UNIQUE
                           PRIMARY KEY,
    articleId INTEGER      REFERENCES article (id) 
                           NOT NULL,
    cardId    INTEGER      REFERENCES card (id) 
                           NOT NULL,
    tagId     VARCHAR (16) NOT NULL,
    revision  INTEGER (8)  NOT NULL,
    type      VARCHAR (16),
    data      BLOB,
    created   INTEGER (4)  NOT NULL,
    modified  INTEGER (4)  NOT NULL,
    UNIQUE (
        articleId,
        tagId
    )
);


-- Table: attachCode
CREATE TABLE attachCode (
    id        INTEGER     PRIMARY KEY
                          UNIQUE
                          NOT NULL,
    accountId INTEGER     REFERENCES account (id) 
                          NOT NULL,
    token     BLOB (16)   NOT NULL,
    issued    INTEGER (4) NOT NULL
);


-- Table: card
CREATE TABLE card (
    id          INTEGER        PRIMARY KEY
                               UNIQUE
                               NOT NULL,
    accountId   INTEGER        REFERENCES account (id) 
                               NOT NULL,
    cardId      VARCHAR (16)   NOT NULL,
    did         BLOB           NOT NULL,
    username    VARCHAR (64)   NOT NULL,
    name        VARCHAR (64),
    description VARCHAR (4096),
    location    VARCHAR (64),
    revision    INTEGER (64)   NOT NULL,
    image       BLOB,
    node        VARCHAR (1024) NOT NULL,
    status      VARCHAR (16)   NOT NULL,
    token       BLOB (64),
    UNIQUE (
        accountId,
        cardId
    )
);


-- Table: cardGroup
CREATE TABLE cardGroup (
    id      INTEGER PRIMARY KEY
                    UNIQUE
                    NOT NULL,
    cardId  INTEGER REFERENCES card (id),
    groupId INTEGER REFERENCES [group] (id) 
);


-- Table: config
CREATE TABLE config (
    id        INTEGER        PRIMARY KEY
                             UNIQUE
                             NOT NULL,
    [key]     VARCHAR (8)    UNIQUE
                             NOT NULL,
    strValue  VARCHAR (1024),
    numValue  INTEGER (8),
    boolValue BOOLEAN
);


-- Table: dialogue
CREATE TABLE dialogue (
    id              INTEGER      PRIMARY KEY
                                 UNIQUE
                                 NOT NULL,
    accountId       INTEGER      REFERENCES account (id),
    dialogueId      VARCHAR (16) NOT NULL,
    subjectRevision INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    type            VARCHAR (16),
    data            BLOB,
    created         INTEGER      NOT NULL,
    modified        INTEGER      NOT NULL,
    active          BOOLEAN      NOT NULL,
    memberRevision  INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    topicUpdated    INTEGER (4)  NOT NULL,
    topicRevision   INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    UNIQUE (
        accountId,
        dialogueId
    )
);


-- Table: dialogueMember
CREATE TABLE dialogueMember (
    id         INTEGER     PRIMARY KEY
                           UNIQUE
                           NOT NULL,
    dialogueId INTEGER     REFERENCES dialogue (id) 
                           NOT NULL,
    cardId     INTEGER     REFERENCES card (id) 
                           NOT NULL,
    added      INTEGER (4) NOT NULL
);


-- Table: group
CREATE TABLE [group] (
    id        INTEGER      PRIMARY KEY
                           UNIQUE
                           NOT NULL,
    groupId   VARCHAR (16) NOT NULL,
    accountId INTEGER      REFERENCES account (id) 
                           NOT NULL,
    revision  INTEGER (8)  NOT NULL
                           DEFAULT (0),
    type      VARCHAR (16),
    data      BLOB,
    created   INTEGER (32) NOT NULL,
    modified  INTEGER (4)  NOT NULL,
    UNIQUE (
        groupId,
        accountId
    )
);


-- Table: insight
CREATE TABLE insight (
    id              INTEGER      PRIMARY KEY
                                 NOT NULL
                                 UNIQUE,
    accountId       INTEGER      REFERENCES account (id) 
                                 NOT NULL,
    cardId          INTEGER      REFERENCES card (id) 
                                 NOT NULL,
    dialogueId      VARCHAR (16) NOT NULL,
    subjectRevision INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    memberRevision  INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    topicRevision   INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    UNIQUE (
        cardId,
        dialogueId
    )
);


-- Table: label
CREATE TABLE label (
    id        INTEGER      UNIQUE
                           PRIMARY KEY
                           NOT NULL,
    labelId   VARCHAR (16) NOT NULL,
    accountId INTEGER      REFERENCES account (id) 
                           NOT NULL,
    revision  INTEGER (8)  NOT NULL
                           DEFAULT (0),
    type      VARCHAR (16),
    data      BLOB,
    created   INTEGER (4)  NOT NULL,
    modified  INTEGER (4)  NOT NULL,
    UNIQUE (
        labelId,
        accountId
    )
);


-- Table: labelGroup
CREATE TABLE labelGroup (
    id      INTEGER PRIMARY KEY
                    UNIQUE
                    NOT NULL,
    labelId INTEGER REFERENCES label (id),
    groupId INTEGER REFERENCES [group] (id) 
);


-- Table: topic
CREATE TABLE topic (
    id              INTEGER      PRIMARY KEY
                                 UNIQUE
                                 NOT NULL,
    accountId       INTEGER      REFERENCES account (id) 
                                 NOT NULL,
    dialogueId      INTEGER      REFERENCES dialogue (id) 
                                 NOT NULL,
    topicId         VARCHAR (16) NOT NULL,
    cardId          INTEGER      REFERENCES card (id),
    status          VARCHAR (16) NOT NULL,
    subjectRevision INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    type            VARCHAR (16),
    data            BLOB,
    created         INTEGER (4),
    modified        INTEGER (4),
    tagUpdated      INTEGER (4),
    tagRevision     INTEGER (8)  NOT NULL
                                 DEFAULT (0),
    UNIQUE (
        accountId,
        topicId
    )
);


-- Table: topicAsset
CREATE TABLE topicAsset (
    id            INTEGER      PRIMARY KEY
                               UNIQUE
                               NOT NULL,
    topicId       INTEGER      REFERENCES topic (id) 
                               NOT NULL,
    assetId       VARCHAR (16) NOT NULL,
    originalId    INTEGER      REFERENCES topicAsset (id) 
                               NOT NULL,
    status        VARCHAR (16),
    size          INTEGER (8),
    crc           INTEGER (4),
    transform     VARCHAR (16),
    transformData BLOB,
    UNIQUE (
        topicId,
        assetId
    )
);


-- Table: topicTag
CREATE TABLE topicTag (
    id                    PRIMARY KEY
                          UNIQUE
                          NOT NULL,
    topicId  INTEGER      REFERENCES topic (id) 
                          NOT NULL,
    cardId   INTEGER      REFERENCES card (id),
    tagId    VARCHAR (16) NOT NULL,
    revision INTEGER (8)  NOT NULL
                          DEFAULT (0),
    type     VARCHAR (16),
    data     BLOB,
    created  INTEGER (4)  NOT NULL,
    modified INTEGER (4)  NOT NULL,
    UNIQUE (
        topicId,
        tagId
    )
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
