import type { Channel, Topic, AssetSource, Asset, Tag, Article, Group, Card, Profile, Call, FocusDetail, Config, Setup, Member, Participant, PushParams } from './types';

export interface Session {
  getSettings(): Settings;
  getIdentity(): Identity;
  getContact(): Contact;
  getAlias(): Alias;
  getAttribute(): Attribute;
  getContent(): Content;
  getRing(): Ring;

  setFocus(cardId: string | null, channelId: string): Promise<Focus>;
  clearFocus(): void;

  addStatusListener(ev: (status: string) => void): void;
  removeStatusListener(ev: (status: string) => void): void;
}

export interface Link {
  setStatusListener(ev: (status: string) => Promise<void>): void;
  clearStatusListener(): void;
  setMessageListener(ev: (message: any) => Promise<void>): void;
  clearMessageListener(): void;

  getIce(): { urls: string; username: string; credential: string }[];
  sendMessage(message: any): Promise<void>;

  close(): Promise<void>;
}

export interface Ring {
  addRingingListener(ev: (calls: Call[]) => void): void;
  removeRingingListener(ev: (calls: Call[]) => void): void;

  accept(cardId: string, callId: string, contactNode: string): Promise<Link>;
  decline(cardId: string, callId: string, contactNode: string): Promise<void>;
  ignore(cardId: string, callId: string): Promise<void>;
}

export interface Settings {
  getUsernameStatus(username: string): Promise<boolean>;
  setLogin(username: string, password: string): Promise<void>;
  enableNotifications(params?: PushParams): Promise<void>;
  disableNotifications(): Promise<void>;
  enableRegistry(): Promise<void>;
  disableRegistry(): Promise<void>;
  enableMFA(): Promise<{ secretImage: string; secretText: string }>;
  disableMFA(): Promise<void>;
  confirmMFA(code: string): Promise<void>;
  setSeal(password: string): Promise<void>;
  clearSeal(): Promise<void>;
  unlockSeal(password: string): Promise<void>;
  updateSeal(password: string): Promise<void>;
  forgetSeal(): Promise<void>;

  getBlockedCards(): Promise<{cardId: string, timestamp: number}[]>;
  getBlockedChannels(): Promise<{cardId: string | null, channelId: string, timestamp: number}[]>;
  getBlockedTopicis(): Promise<{cardId: string | null, channelId: string, topicId: string, timestamp: number}[]>;

  addConfigListener(ev: (config: Config) => void): void;
  removeConfigListener(ev: (config: Config) => void): void;
}

export interface Identity {
  setProfileData(name: string, location: string, description: string): Promise<void>;
  setProfileImage(image: string): Promise<void>;

  getProfileImageUrl(): string;

  addProfileListener(ev: (profile: Profile) => void): void;
  removeProfileListener(ev: (profile: Profile) => void): void;
}

export interface Contact {
  addCard(server: string | null, guid: string): Promise<string>;
  removeCard(cardId: string): Promise<void>;
  confirmCard(cardId: string): Promise<void>;
  connectCard(cardId: string): Promise<void>;
  disconnectCard(cardId: string): Promise<void>;
  denyCard(cardId: string): Promise<void>;
  ignoreCard(cardId: string): Promise<void>;
  resyncCard(cardId: string): Promise<void>;
  flagCard(cardId: string): Promise<void>;
  setBlockedCard(cardId: string, blocked: boolean): Promise<void>;
  getRegistry(handle: string | null, server: string | null): Promise<Profile[]>;

  callCard(cardId: string, ringInterval: number): Promise<Link>;

  addCardListener(ev: (cards: Card[]) => void): void;
  removeCardListener(ev: (cards: Card[]) => void): void;
}

export interface Content {
  addChannel(sealed: boolean, type: string, subject: any, cardIds: string[]): Promise<string>;
  removeChannel(channelId: string): Promise<void>;
  setChannelSubject(channelId: string, type: string, subject: any): Promise<void>;
  setChannelCard(channelId: string, cardId: string): Promise<void>;
  clearChannelCard(channelId: string, cardId: string): Promise<void>;

  leaveChannel(cardId: string, channelId: string): Promise<void>;

  getChannelNotifications(cardId: string | null, channelId: string): Promise<boolean>;
  setChannelNotifications(cardId: string | null, channelId: string, enabled: boolean): Promise<void>;
  setUnreadChannel(cardId: string | null, channelId: string, unread: boolean): Promise<void>;

  flagChannel(cardId: string | null, channelId: string): Promise<void>;
  setBlockedChannel(cardId: string | null, channelId: string, blocked: boolean): Promise<void>;
  clearBlockedChannelTopic(cardId: string | null, channelId: string, topicId: string): Promise<void>;

  addChannelListener(ev: (arg: { channels: Channel[]; cardId: string | null }) => void): void;
  removeChannelListener(ev: (arg: { channels: Channel[]; cardId: string | null }) => void): void;

  addLoadedListener(ev: (loaded: boolean) => void): void;
  removeLoadedListener(ev: (loaded: boolean) => void): void;
}

export interface Alias {
  addGroup(sealed: boolean, type: string, subject: string, cardIds: string[]): Promise<string>;
  removeGroup(groupId: string): Promise<void>;
  setGroupSubject(groupId: string, subject: string): Promise<void>;
  setGroupCard(groupId: string, cardId: string): Promise<void>;
  clearGroupCard(groupId: string, cardId: string): Promise<void>;
  compare(groupIds: string[], cardIds: string[]): Promise<Map<string, string[]>>;

  addGroupListener(ev: (groups: Group[]) => void): void;
  removeGroupListener(ev: (groups: Group[]) => void): void;
}

export interface Attribute {
  addArticle(sealed: boolean, type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string>;
  removeArticle(articleId: string): Promise<void>;
  setArticleSubject(articleId: string, subject: string): Promise<void>;
  setArticleCard(articleId: string, cardId: string): Promise<void>;
  clearArticleCard(articleId: string, cardId: string): Promise<void>;
  setArticleGroup(articleId: string, groupId: string): Promise<void>;
  clearArticleGroup(articleId: string, groupId: string): Promise<void>;

  addArticleListener(ev: (articles: Article[]) => void): void;
  removeArticleListener(ev: (articles: Article[]) => void): void;
}

export interface Focus {
  getFocused(): {cardId: null|string, channelId: string};

  addTopic(sealed: boolean, type: string, subject: (assets: {assetId: string, appId: string}[])=>any, assets: AssetSource[], progress: (percent: number)=>boolean): Promise<string>;
  setTopicSubject(topicId: string, type: string, subject: (assets: {assetId: string, appId: string}[])=>any, files: AssetSource[], progress: (percent: number)=>boolean): Promise<void>;
  removeTopic(topicId: string): Promise<void>;

  viewMoreTopics(): Promise<void>;

  getTopicAssetUrl(topicId: string, assetId: string, progress?: (percent: number) => boolean|void): Promise<string>;

  flagTopic(topicId: string): Promise<void>;
  setBlockTopic(topicId: string): Promise<void>;
  clearBlockTopic(topicId: string): Promise<void>;

  addTopicListener(ev: (topics: null | Topic[]) => void): void;
  removeTopicListener(ev: (topics: null | Topic[]) => void): void;

  addDetailListener(ev: (focused: { cardId: string | null, channelId: string, detail: FocusDetail | null }) => void): void;
  removeDetailListener(ev: (focused: { cardId: string | null, channelId: string, detail: FocusDetail | null }) => void): void;
}

export interface Service {
  getMembers(): Promise<Member[]>;
  createMemberAccess(): Promise<string>;
  resetMemberAccess(): Promise<string>;
  blockMember(flag: boolean): Promise<void>;
  removeMember(accountId: number): Promise<void>;
  getSetup(): Promise<Setup>;
  setSetup(setup: Setup): Promise<void>;
  enableMFAuth(): Promise<{ image: string, text: string }>;
  confirmMFAuth(code: string): Promise<void>;
  disableMFAuth(): Promise<void>;
}

export interface Contributor {
  addTopic(type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(topicId: string): Promise<void>;
  addTag(topicId: string, type: string, value: string): Promise<string>;
  removeTag(topicId: string, tagId: string): Promise<void>;
}
