import { HostingMode } from './types';

export type CardDetail = {
  revision: number;
  status: string;
  statusUpdated: number;
  token: string;
};

export type CardProfile = {
  revision: number;
  handle: string;
  guid: string;
  name: string;
  description: string;
  location: string;
  imageSet: boolean;
  node: string;
  version: string;
  seal: string;
};

export type ChannelSummary = {
  revision: number;
  sealed: boolean;
  guid: string;
  dataType: string;
  data: string;
  created: number;
  updated: number;
  status: string;
  transform: string;
};

export type ChannelDetail = {
  revision: number;
  sealed: boolean;
  dataType: string;
  data: string;
  created: number;
  updated: number;
  enableImage: boolean;
  enableAudio: boolean;
  enableVideo: boolean;
  enableBinary: boolean;
  contacts: {
    groups: [string];
    cards: [string];
  };
  members: [string];
};

export type ArticleDetail = {
  revision: number;
  sealed: boolean;
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

export type CardItem = {
  offsyncProfile: number | null;
  offsyncArticle: number | null;
  offsyncChannel: number | null;
  revision: number;
  profile: CardProfile;
  detail: CardDetail;
  profileRevision: number;
  articleRevision: number;
  channelRevision: number;
};

export const defaultCardItem = {
  offsyncProfile: null,
  offsyncArticle: null,
  offsyncChannel: null,
  revision: 0,
  profile: {
    revision: 0,
    handle: '',
    guid: '',
    name: '',
    description: '',
    location: '',
    imageSet: false,
    node: '',
    version: '',
    seal: '',
  },
  detail: {
    revision: 0,
    status: '',
    statusUpdated: 0,
    token: 0,
  },
  profileRevision: 0,
  articleRevision: 0,
  channelRevision: 0,
};

export type ArticleItem = {
  detail: ArticleDetail;
  unsealedDetail: string | null;
};

export type ChannelItem = {
  summary: ChannelSummary;
  detail: ChannelDetail;
  channelKey: string | null;
  unsealedDetail: string | null;
  unsealedSummary: string | null;
};

export const defaultChannelItem = {
  summary: {
    revision: 0,
    sealed: false,
    guid: '',
    dataType: '',
    data: '',
    created: 0,
    updated: 0,
    status: '',
    transform: '',
  },
  detail: {
    revision: 0,
    sealed: false,
    dataType: '',
    data: '',
    created: 0,
    updated: 0,
    enableImage: false,
    enableAudio: false,
    enableVideo: false,
    enableBinary: false,
    contacts: {
      groups: [],
      cards: [],
    },
    members: [],
  },
  channelKey: null,
  unsealedDetail: null,
  unsealedSummary: null,
};

export type TopicDetail = {
  revision: number;
  guid: string;
  sealed: boolean;
  dataType: string;
  data: any;
  assets: AssetItem[];
  created: number;
  updated: number;
  status: string;
  transform: string;
};

export type TopicItem = {
  detail: TopicDetail;
  unsealedDetail: string | null;
  position: number;
};

export type AssetItem = {
  assetIndex: number;
  mimeType: string;
  encrypted: boolean;
  hosting: string;
  extension: string;
  split?: { blockId: string, blockIv: string }[];
  basic?: string;
  inline?: string;
};

export const defaultTopicItem = {
  detail: {
    revision: 0,
    guid: '',
    sealed: false,
    dataType: '',
    data: null,
    created: 0,
    updated: 0,
    status: '',
    transform: '',
  },
  unsealedDetail: null,
  position: 0,
};
