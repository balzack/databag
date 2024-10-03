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
  members: {
    member: string;
    pushEnabled: boolean;
  };
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
  offsync: boolean;
  blocked: boolean;
  revision: number;
  profile: CardProfile;
  detail: CardDetail;
  profileRevision: number;
  articleRevision: number;
  channelRevision: number;
};

export const defaultCardItem = {
  offsync: false,
  blocked: false,
  revision: 0,
  profile: {
    revision: 0,
    handle: "",
    guid: "",
    name: "",
    description: "",
    location: "",
    imageSet: false,
    node: "",
    seal: "",
  },
  detail: {
    revision: 0,
    status: "",
    statusUpdated: 0,
    token: 0,
  },
  profileRevision: 0,
  articleRevision: 0,
  channelRevision: 0,
};

export type ArticleItem = {
  blocked: boolean;
  detail: ArticleDetail;
  unsealedData: string | null;
};

export type ChannelItem = {
  unread: boolean;
  blocked: boolean;
  summary: ChannelSummary;
  detail: ChannelDetail;
  channelKey: string | null;
  unsealedDetail: string | null;
  unsealedSummary: string | null;
};

export const defaultChannelItem = {
  unread: false,
  blocked: false,
  summary: {
    revision: 0,
    sealed: false,
    guid: "",
    dataType: "",
    data: "",
    created: 0,
    updated: 0,
    status: "",
    transform: "",
  },
  detail: {
    revision: 0,
    sealed: false,
    dataType: "",
    data: "",
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
