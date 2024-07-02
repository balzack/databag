export type Card = {
  id: string,
  status: string,
  statusUpdated: number,
  notes: string,
  groups: string[],
  guid: string,
  handle: string,
  name: string,
  description: string,
  location: string,
  imageSet: boolean,
  version: string,
  node: string,
}

export type Channel = {
  id: string,
  cardId?: string,
  lastTopic: {
    guid: string,
    dataType: string,
    data: string,
    created: number,
    updated: number,
    status: string,
    transform: string
  }
  unread: boolean,
  sealed: boolean,
  dataType: string,
  data: string,
  created: number,
  updated: number,
  enableImage: boolean,
  enableAudio: boolean,
  enableVideo: boolean,
  enableBinary: boolean,
  contacts?: {
    groups: string[],
    cards: string[],
  },
  members: {
    member: string,
    pushEnabled: boolean,
  },
  repeaters: Repeater[];
}

export type Topic = {
  id: string,
  guid: string,
  dataType: string,
  data: string,
  created: number,
  updated: number,
  status: string,
  transform: string,
  tags: Tag[]
}

export type Tag = {
  id: string,
  guid: string,
  dataType: string,
  data: string,
  created: number,
  updated: number,
}

export type Asset = {
  path: string,
  fileType: string,
}

export type Group = {
  id: string,
  dataType: string,
  data: string,
  created: number,
  updated: number,
  cards: string[]
}

export type Article = {
  id: string,
  dataType: string,
  data: string,
  created: number,
  updated: number,
  contacts?: {
    cards: string[],
    groups: string[],
  }
}

export type Repeater = {
  id: string,
  guid: string,
  name: string,
  token: string,
  server: string,
}

export type AccountStatus = {
  disabled: boolean,
  storageUsed: number,
  storageAvailable: number,
  forwardingAddress: string,
  searchable: boolean,
  allowUnsealed: boolean,
  pushEnabled: boolean,
  sealable: boolean,
  sealSet: boolean,
  enableIce: boolean,
  multiFactorAuth: boolean,
  webPushKey: string,
}

export type Profile = {
  guid: string,
  handle: string,
  name: string,
  description: string,
  location: string,
  image: string,
  sealSet: string,
  version: string,
  node: string,
}

export type NodeAccount = {
  accountId: number,
  guid: string,
  handle: string,
  name: string,
  description: string,
  location: string,
  imageSet: boolean,
  disabled: boolean,
}

export type NodeConfig = {
  domain: string,
  accountStorage: string,
  enableImage: boolean,
  enableAudio: boolean,
  enableVideo: boolean,
  enableBinary: boolean,
  keyType: string,
  pushSupported: boolean,
  allowUnsealed: boolean,
  transformSupported: boolean,
  enableIce: boolean,
  iceService: string,
  iceUrl: string,
  iceUsername: string,
  icePassword: string,
  enableOpenAccess: boolean,
  openAccessLimit: number,
}

export type SessionParams = {
  initialTopicCount: number,
  channelTypes: string[],
  topicTypes: string[],
  tagTypes: string[],
}

