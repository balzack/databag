export type CardNotification = {
  profile: number,
  article: number,
  channel: number,
}

export type CardDetail = {
  revision: number,
  status: string,
  statusUpdated: number,
  token: string,
}

export type CardProfile = {
  revision: number,
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
  sealed: boolean,
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
  sealed: boolean,
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
  offsync: boolean,
  blocked: boolean,
  revision: number,
  profile: CardProfile,
  detail: CardDetail,
  remote: CardNotification,
  sync: CardNotification,
}

export const defaultCardItem = {
  offsync: false,
  blocked: false,
  cardRevision: 0,
  profileRevision: 0,
  profile: {
    handle: '',
    guid: '',
    name: '',
    description: '',
    location: '',
    imageSet: false,
    node: '',
    seal: '',    
  },
  detailRevision: 0,
  detail: {
    status: '',
    statusUpdateed: 0,
    token: 0,
  },
  remote: {
    profile: 0,
    article: 0,
    channel: 0,
  },
  sync: {
    profile: 0,
    article: 0,
    channel: 0,
  },
};

export type ArticleItem = {
  blocked: boolean,
  detail: ArticleDetail,
  unsealedData: any,
  revision: ArticleRevision,
}  

export type ChannelItem = {
  unread: boolean,
  blocked: boolean,
  summary: ChannelSummary,
  detail: ChannelDetail,
  unsealedChannelData: any,
  unsealedTopicData: any,
  revision: ChannelRevision,
}
