import type { Profile } from './types';

export type ContactStatus = {
  token: string;
  status: string;
  viewRevision: number;
  channelRevision: number;
  profileRevision: number;
  articleRevision: number;
};

export type DataMessage = {
  message: string;
  keyType: string;
  publicKey: string;
  signature: string;
  signatureType: string;
};

export type CardDetailEntity = {
  status: string;
  statusUpdated: number;
  token: string;
  notes: string;
  groups: [string];
};

export type CardProfileEntity = {
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  imageSet: boolean;
  version: string;
  node: string;
  seal: string;
  revision: number;
};

export type CardEntity = {
  id: string;
  revision: number;
  data?: {
    detailRevision: number;
    profileRevision: number;
    notifiedProfile: number;
    notifiedArticle: number;
    notifiedChannel: number;
    cardDetail?: CardDetailEntity;
    cardProfile?: CardProfileEntity;
  };
};

export type ChannelSummaryEntity = {
  lastTopic: {
    guid: string;
    dataType: string;
    data: string;
    created: number;
    updated: number;
    status: string;
    transform: string;
  };
};

export type ChannelDetailEntity = {
  dataType: string;
  data: string;
  created: number;
  updated: number;
  enableImage: boolean;
  enableAudio: boolean;
  enableVideo: boolean;
  enableBinary: boolean;
  contacts: {
    groups: string[];
    cards: string[];
  };
  members: string[];
};

export type ChannelEntity = {
  id: string;
  revision: number;
  data: {
    detailRevision: number;
    topicRevision: number;
    channelSummary?: ChannelSummaryEntity;
    channelDetail?: ChannelDetailEntity;
  };
};

export type TopicDetailEntity = {
  guid: string;
  dataType: string;
  data: string;
  created: number;
  updated: number;
  status: string;
  transform: string;
}

export type TopicEntity = {
  id: string;
  revision: number;
  data?: {
    detailRevision: number;
    tagRevision: number;
    topicDetail: TopicDetailEntity;
  };
};

export type TagEntity = {
  id: string;
  revision: number;
  data?: {
    guid: string;
    dataType: string;
    data: string;
    created: number;
    updated: number;
  };
};

export type AssetEntity = {
  assetId: string;
  transform: string;
  status: string;
};

export type RepeaterEntity = {
  id: string;
  revision: number;
  data?: {
    name: string;
    token: string;
  };
};

export type GroupEntity = {
  id: string;
  revision: number;
  data?: {
    dataType: string;
    data: string;
    created: number;
    updated: number;
    cards: [string];
  };
};

export type ArticleEntity = {
  id: string;
  revision: number;
  data?: {
    dataType: string;
    data: string;
    created: number;
    updated: number;
    status: string;
    contacts?: {
      cards: [string];
      groups: [string];
    };
  };
};

export type SealEntity = {
  passwordSalt: string;
  privateKeyIv: string;
  privateKeyEncrypted: string;
  publicKey: string;
};

export type ConfigEntity = {
  disabled: boolean;
  storageUsed: number;
  storageAvailable: number;
  forwardingAddress: string;
  searchable: boolean;
  allowUnsealed: boolean;
  pushEnabled: boolean;
  sealable: boolean;
  seal: SealEntity;
  enableIce: boolean;
  mfaEnabled: boolean;
  webPushKey: string;
};

export const defaultConfigEntity = {
  disabled: false,
  storageUsed: 0,
  storageAvailable: 0,
  forwardingAddress: '',
  searchable: false,
  allowUnsealed: false,
  pushEnabled: false,
  seal: {
    passwordSalt: '',
    privateKeyIv: '',
    privateKeyEncrypted: '',
    publicKey: '',
  },
  sealable: false,
  enableIce: false,
  mfaEnabled: false,
  webPushKey: '',
};

export type ProfileEntity = {
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  image: string;
  revision: number;
  seal?: string;
  version: string;
  node: string;
};

export type AccountEntity = {
  accountId: number;
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  imageSet: boolean;
  revision: number;
  seal?: string;
  version: string;
  node: string;
  storageUsed: number;
  disabled: boolean;
};

export const defaultProfileEntity = {
  guid: '',
  handle: '',
  name: '',
  description: '',
  location: '',
  image: '',
  revision: 0,
  version: '',
  node: '',
};

export type SetupEntity = {
  domain: string;
  accountStorage: number;
  enableImage: boolean;
  enableAudio: boolean;
  enableVideo: boolean;
  enableBinary: boolean;
  keyType: string;
  pushSupported: boolean;
  allowUnsealed: boolean;
  transformSupported: boolean;
  enableIce: boolean;
  iceService: string;
  iceUrl: string;
  iceUsername: string;
  icePassword: string;
  enableOpenAccess: boolean;
  openAccessLimit: number;
};

export type Calling = {
  id: string;
  cardId: string;
  callerToken: string;
  calleeToken: string;
  keepAlive: number;
  ice: { urls: string; username: string; credential: string }[];
}

export type Ringing = {
  callId: string;
  calleeToken: string;
  ice: { urls: string[]; username: string; credential: string }[];
  iceUrl?: string;
  iceUsername?: string;
  icePassword?: string;
};

export type Revision = {
  account: number;
  profile: number;
  article: number;
  group: number;
  channel: number;
  card: number;
};

export type Login = {
  guid: string;
  node: string;
  secure: boolean;
  token: string;
  timestamp: number;
  pushSupported: boolean;
};

export type BasicAsset = {
  encrypted?: { type: string, thumb: string, label: string, extension: string, parts: { blockIv: string, partId: string }[] },
  image?: { thumb: string, full: string },
  audio?: { label: string, full: string },
  video?: { thumb: string, lq: string, hd: string },
  binary?: { label: string, extension: string, data: string }
}

export type BasicEntity = {
  text: string,
  textColor: string,
  textSize: string,
  assets: BasicAsset[], 
}

export type SealedBasicEntity = {
  messageEncrypted: string,
  messageIv: string
}

export const avatar =
  'data:image/png;base64,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';
