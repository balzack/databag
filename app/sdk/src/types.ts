export type SealKey = {
  publicKey: string,
  privateKey: string,
}

export type Seal = {
  passwordSalt: string,
  privateKeyIv: string,
  privateKeyEncrypted: string,
  publicKey: string,
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
  seal: Seal,
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
  revision: number,
  seal: string,
  version: string,
  node: string,
}

export type Card = {
}

export type Channel = {
  id: string,
  revision: number,
  data: {
    detailRevision: number,
    topicRevision: number,
    channelSummary?: {
      lastTopic: {
        guid: string,
        dataType: string,
        data: string,
        created: number,
        updated: number,
        status: string,
        transform: string
      }
    },
    channelDetail?: {
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
    },
  }
}

export type Topic = {
}

export type Asset = {
}

export type Group = {
}

export type Article = {
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

export type SignedMessage = {
  message: string,
  keyType: string,
  publicKey: string,
  signature: string,
  signatureType: string,
}

export type ContactStatus = {
  token: string,
  profileRevision: number,
  articleRevision: number,
  channelRevision: number,
  viewRevision: number,
  status: string, 
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

