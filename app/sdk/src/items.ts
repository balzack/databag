export type CardRevision = {
  detail: number,
  profile: number,
}

export type CardNotification = {
  profile: number,
  article: number,
  channel: number,
}

export type CardDetail = {
  status: string,
  statusUpdated: number,
  token: string,
}

export type CardProfile = {
  handle: string,
  guid: string,
  name: string,
  description: string,
  location: string,
  imageSet: boolean,
  node: string,
  seal: string,
}

export type ChannelRevision = {
  topic: number,
  detail: number,
}

export type ChannelSummary = {
  guid: string,
  dataType: string,
  data: string,
  created: number,
  updated: number,
  status: string,
  transform: string
}

export type ChannelDetail = {
  revision: number,
  dataType: string,
  data: string,
  created: number,
  updated: number,
  enableImage: boolean,
  enableAudio: boolean,
  enableVideo: boolean,
  enableBinary: boolean,
  contacts: {
    groups: [ string ],
    cards: [ string ],
  },
  members: {
    member: string,
    pushEnabled: boolean,
  },
}

export type ArticleRevision = {
  detail: number,
}

export type ArticleDetail = {
  dataType: string,
  data: string,
  created: number,
  updated: number,
  status: string,
  contacts?: {
    cards: [ string ],
    groups: [ string ],
  }
}

export type CardItem = { 
  cardId: string,
  offsync: boolean,
  blocked: boolean,
  revision: CardRevision,
  profile: CardProfile,
  detail: CardDetail,
  remote: CardNotification,
  sync: CardNotification,
}

export type ArticleItem = {
  cardId: string | null,
  articleId: string,
  blocked: boolean,
  detail: ArticleDetail,
  unsealedData: any,
  revision: ArticleRevision,
}  

export type ChannelItem = {
  cardId: string | null,
  channelId: string,
  blocked: boolean,
  summary: ChannelSummary,
  detail: ChannelDetail,
  unsealedData: any,
  revision: ChannelRevision,
}
