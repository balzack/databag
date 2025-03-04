export type Card = {
  cardId: string;
  offsync: boolean;
  blocked: boolean;
  sealable: boolean;
  status: string;
  statusUpdated: number;
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  imageSet: boolean;
  version: string;
  node: string;
};

export type Call = {
  cardId: string;
  callId: string;
  calleeToken: string;
  ice: { urls: string; username: string; credential: string }[];
};

export type Revision = {
  account: number;
  profile: number;
  article: number;
  group: number;
  channel: number;
  card: number;
};

export type Activity = {
  revision?: Revision;
  phone?: Call;
};

export type Channel = {
  channelId: string;
  cardId: string | null;
  lastTopic: {
    guid: string;
    sealed: boolean;
    dataType: string;
    data: any;
    created: number;
    updated: number;
    status: string;
    transform: string;
  };
  blocked: boolean;
  unread: boolean;
  sealed: boolean;
  locked: boolean;
  dataType: string;
  data: any;
  created: number;
  updated: number;
  enableImage: boolean;
  enableAudio: boolean;
  enableVideo: boolean;
  enableBinary: boolean;
  members: Membership[];
};

export type FocusDetail = {
  sealed: boolean;
  locked: boolean;
  dataType: string;
  data: any;
  enableImage: boolean;
  enableAudio: boolean;
  enableVideo: boolean;
  enableBinary: boolean;
  created: number;
  members: Membership[];
}

export type Membership = {
  guid: string;
  //pushEnabled: boolean;
  //canAddTopic: boolean,
  //canAddTag: boolean,
  //canAddAsset: boolean,
  //canAddParticipant: boolean,
  //canSortTopic: boolean,
  //canSortTag: boolean,
  //participants: Participant[];
};

export type Participant = {
  id: string;
  name: string;
  token: string;
  node: string;
  secure: boolean;
};

export type Topic = {
  topicId: string;
  guid: string;
  sealed: boolean;
  locked: boolean;
  blocked: boolean;
  dataType: string;
  data: any;
  created: number;
  updated: number;
  status: string;
  transform: string;
  assets: Asset[];
};

export type Tag = {
  id: string;
  sealed: boolean;
  unsealed: boolean;
  guid: string;
  dataType: string;
  data: any;
  created: number;
  updated: number;
  sortOrder: number;
};

export enum HostingMode {
  Inline = 'inline', // sealed or unsealed 
  Split = 'split', // sealed only, split file into blocks
  Basic = 'basic', // unsealed only, basic download
}

export enum TransformType {
  Copy = 'copy', // server hosts copy of asset
  Thumb = 'thumb', // extract thumb
  HighQuality = 'high', // transcode at high quality
  LowQuality = 'low', // transcode to low quality
}

export enum AssetType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Binary = 'binary',
}

export type AssetSource = {
  type: AssetType;
  source: File|string;
  transforms: {type: TransformType, appId: string, position?: number, thumb?: ()=>Promise<string>}[],
}

export type Asset = {
  assetId: string;
  hosting: HostingMode;
};

export type Group = {
  id: string;
  sealed: boolean;
  unsealed: boolean;
  dataType: string;
  data: string;
  created: number;
  updated: number;
  cards: string[];
};

export type Article = {
  cardId: string;
  articleId: string;
  blocked: boolean;
  sealed: boolean;
  dataType: string;
  data: any;
  created: number;
  updated: number;
  contacts?: {
    cards: string[];
    groups: string[];
  };
};

export type Config = {
  disabled: boolean;
  storageUsed: number;
  storageAvailable: number;
  forwardingAddress: string;
  searchable: boolean;
  allowUnsealed: boolean;
  pushEnabled: boolean;
  sealSet: boolean;
  sealUnlocked: boolean;
  enableIce: boolean;
  mfaEnabled: boolean;
  webPushKey: string;
};

export type Profile = {
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  imageSet: boolean;
  sealSet: boolean;
  version: string;
  node: string;
};

export type Member = {
  accountId: number;
  guid: string;
  handle: string;
  name: string;
  imageUrl: string;
  disabled: boolean;
  storageUsed: number,
};

export enum KeyType {
  RSA_4096 = 'RSA4096',
  RSA_2048 = 'RSA2048',
}

export enum ICEService {
  Cloudflare = 'cloudflare',
  Default = 'default',
}

export type Setup = {
  domain: string;
  accountStorage: number;
  enableImage: boolean;
  enableAudio: boolean;
  enableVideo: boolean;
  enableBinary: boolean;
  keyType: KeyType;
  pushSupported: boolean;
  allowUnsealed: boolean;
  transformSupported: boolean;
  enableIce: boolean;
  iceService: ICEService;
  iceUrl: string;
  iceUsername: string;
  icePassword: string;
  enableOpenAccess: boolean;
  openAccessLimit: number;
};

export type Params = {
  channelTypes: string[];
};

export type SessionParams = {
  pushType: string;
  deviceToken: string;
  notifications: { event: string; messageTitle: string }[];

  deviceId: string;
  version: string;
  appName: string;
};

export enum PushType {
  UPN = 'upn', // unified push notifications
  Web = 'web', // browser push notifications
  FCM = 'fcm', // firebase cloud messaging
}

export type PushParams = {
  endpoint: string;
  publicKey: string;
  auth: string;
  type: PushType;
}

