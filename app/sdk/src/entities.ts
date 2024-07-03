import type { Seal } from './types';

export type CardEntity = {
  id: string,
  revision: number,
  data?: {
    detailRevision: number,
    profileRevision: number,
    notifiedProfile: number,
    notifiedArticle: number,
    notifiedChannel: number,
    cardDetail: {
      status: string,
      statusUpdated: number,
      token: string,
      notes: string,
      groups: [ string ]
    },
    cardProfile: {
      guid: string,
      handle: string,
      name: string,
      description: string,
      location: string,
      imageSet: boolean,
      version: string,
      node: string,
      seal: string,
      revision: number,
    }
  }
}

export type ChannelEntity = {
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

export type TopicEntity = {
  id: string,
  revision: number,
  data?: {
    detailRevision: number,
    tagRevision: number,
    topicDetail: {
      guid: string,
      dataType: string,
      data: string,
      created: number,
      updated: number,
      status: string,
      transform: string
    }
  }
}

export type TagEntity = {
  id: string,
  revision: number,
  data?: {
    guid: string,
    dataType: string,
    data: string,
    created: number,
    updated: number,
  }
}

export type AssetEntity = {
  assetId: string,
  transform: string,
  status: string,
}

export type RepeaterEntity = {
  id: string,
  revision: number,
  data?: {
    name: string,
    token: string,
  }
}

export type GroupEntity = {
  id: string,
  revision: number,
  data?: {
    dataType: string,
    data: string,
    created: number,
    updated: number,
    cards: [ string ]
  }
}

export type ArticleEntity = {
  id: string,
  revision: number,
  data?: {
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
}

export type AccountEntity = {
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

export type ProfileEntity = {
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
