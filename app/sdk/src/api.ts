// show group card comparison
// remove viewRevision
// add bot api
// formaize delete vs block remote channel
// articles share by cards now

import type { Channel, Topic, Asset, Tag, Article, Group, Card, Profile, Call, AccountStatus, NodeConfig, NodeAccount, Repeater } from './types';

export interface SqlStore {
  set(stmt: string, params?: (string | number | null)[]): Promise<void>;
  get(stmt: string, params?: (string | number | null)[]): Promise<any[]>;
}

export interface WebStore {
  getValue(key: string): Promise<string>;
  setValue(key: string, value: string): Promise<void>;
  clearValue(key: string): Promise<void>;
  clearAll(): Promise<void>;
}

export interface Crypto {
}

export interface Logging {
  error(m: any): void;
  warn(m: any): void;
  info(m: any): void;
}

export interface Session {
  close(): { node: string, secure: boolean, token: string };

  getAccount(): Account;
  getIdentity(): Identity;
  getContact(): Contact;
  getAlias(): Alias;
  getAttribute(): Attribute;
  getContent(): Content;
  getStream(): Stream;
  getRing(): Ring;

  addFocus(cardId: string | null, channelId: string): Focus;
  removeFocus(focus: Focus): void;

  resync(): void;

  addStatusListener(ev: (status: string) => void): void;
  removeStatusListener(ev: (status: string) => void): void;
}

export interface Ring {

  addCallingListener(ev: (calls: Call[]) => void): void;
  removeCallingListener(ev: (calls: Call[]) => void): void;

  addCallListener(ev: (call: Call | null) => void): void;
  removeCallListener(ev: (call: Call | null) => void): void;

  accept(callId: string): void;
  ignore(callId: string): void;
  decline(callId: string): void;
}

export interface Account {
  setLogin(username: string, password: string): Promise<void>;
  enableNotifications(): Promise<void>;
  disableNotifications(): Promise<void>;
  enableRegistry(): Promise<void>;
  disableRegistry(): Promise<void>;
  enableMFA(): Promise<{ secretImage: string, secretText: string }>;
  disableMFA(): Promise<void>;
  confirmMFA(code: string): Promise<void>;
  setAccountSeal(password: string): Promise<void>;
  clearAccountSeal(): Promise<void>;
  unlockAccountSeal(password: string): Promise<void>;

  addStatusListener(ev: (status: AccountStatus) => void): void;
  removeStatusListener(ev: (status: AccountStatus) => void): void;
}

export interface Identity {
  setProfileData(name: string, location: string, description: string): Promise<void>;
  setProfileImage(image: string): Promise<void>;
  getHandleStatus(handle: string): Promise<void>;

  getProfileImageUrl(): string;

  addProfileListener(ev: (profile: Profile) => void): void;
  removeProfileListener(ev: (profile: Profile) => void): void;
}

export interface Contact {
  addCard(server: string, guid: string): Promise<string>;
  removeCard(cardId: string): Promise<void>;
  confirmCard(cardId: string): Promise<void>;
  connectCard(cardId: string): Promise<void>;
  disconnectCard(cardId: string): Promise<void>;
  rejectCard(cardId: string): Promise<void>;
  ignoreCard(cardId: string): Promise<void>;
  resyncCard(cardId: string): Promise<void>;

  removeArticle(cardId: string, articleId: string): Promise<void>;
  removeChannel(cardId: string, channelId: string): Promise<void>;
  addTopic(cardId: string, channelId: string, type: string, subject: string, assets: Asset[]): Promise<string>;
  removeTopic(cardId: string, channelId: string, topicId: string): Promise<void>;
  setTopicSubject(cardId: string, channelId: string, topicId: string, subject: string): Promise<void>;
  addTag(cardId: string, channelId: string, topicId: string, type: string, subject: string): Promise<string>;
  removeTag(cardId: string, topicId: string, tagId: string): Promise<void>;
  setTagSubject(cardId: string, topicId: string, tagId: string, subject: string): Promise<void>;

  getTopics(cardId: string, channelId: string): Promise<Topic[]>;
  getMoreTopics(cardId: string, channelId: string): Promise<Topic[]>;
  getTags(cardId: string, channelId: string, topicId: string): Promise<Tag[]>;
  getMoreTags(cardId: string, channelId: string, topicId: string): Promise<Tag[]>;

  flagCard(cardId: string): Promise<void>;
  flagArticle(cardId: string, articleId: string): Promise<void>;
  flagChannel(cardId: string, channelId: string): Promise<void>;
  flagTopic(cardId: string, channelId: string, topicId: string): Promise<void>;
  flagTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void>;
  setBlockCard(cardId: string): Promise<void>;
  setBlockArticle(cardId: string, articleId: string): Promise<void>;
  setBlockChannel(cardId: string, channelId: string): Promise<void>;
  setBlockTopic(cardId: string, channelId: string, topicId: string): Promise<void>;
  setBlockTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void>;
  clearBlockCard(cardId: string): Promise<void>;
  clearBlockArticle(cardId: string, articleId: string): Promise<void>;
  clearBlockChannel(cardId: string, channelId: string): Promise<void>;
  clearBlockTopic(cardId: string, channelId: string, topicId: string): Promise<void>;
  clearBlockTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void>;
  getBlockedCards(): Promise<{ cardId: string }[]>;
  getBlockedChannels(): Promise<{ cardId: string, channelId: string }[]>;
  getBlockedTopics(): Promise<{ cardId: string, channelId: string, topicId: string }[]>;
  getBlockedTags(): Promise<{ cardId: string, channelId: string, topicId: string, tagId: string }[]>;
  getBlockedArticles(): Promise<{ cardId: string, articleId: string }[]>;

  setUnreadChannel(cardId: string, channelId: string): Promise<void>;
  clearUnreadChannel(cardId: string, channelId: string): Promise<void>;

  getRegistry(server: string): Promise<Profile[]>;
  getRegistryImageUrl(server: string, guid: string): string;

  getCardImageUrl(cardId: string): string;
  getTopicAssetUrl(cardId: string, channelId: string, topicId: string, assetId: string): string;

  addRepeaterAccess(cardId: string, channelId: string, name: string): Promise<Repeater>;
  removeRepeaterAccess(cardId: string, channelId: string, repeaterId: string): Promise<void>;

  addCardListener(ev: (cards: Card[]) => void): void;
  removeCardListener(ev: (cards: Card[]) => void): void;
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

export interface Content {
  addChannel(sealed: boolean, type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string>;
  removeChannel(channelId: string): Promise<void>;
  setChannelSubject(channelId: string, subject: string): Promise<void>;
  setChannelCard(channelId: string, cardId: string): Promise<void>;
  clearChannelCard(channelId: string, cardId: string): Promise<void>;
  setChannelGroup(channelId: string, cardId: string): Promise<void>;
  clearChannelGroup(channelId: string, cardId: string): Promise<void>;
  addTopic(channelId: string, type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(channelId: string, topicId: string): Promise<void>;
  setTopicSubject(channelId: string, topicId: string, subject: string): Promise<void>;
  addTag(channelId: string, topicId: string, type: string, value: string): Promise<string>;
  removeTag(channelId: string, topicId: string, tagId: string): Promise<void>;
  setTagSubject(channelId: string, topicId: string, tagId: string, subject: string): Promise<void>;
  getTopicAssetUrl(channelId: string, topicId: string, assetId: string): string;

  flagTopic(channelId: string, topicId: string): Promise<void>;
  flagTag(channelId: string, topicId: string, tagId: string): Promise<void>;
  setBlockTopic(channelId: string, topicId: string): Promise<void>;
  setBlockTag(channelId: string, topicId: string, tagId: string): Promise<void>;
  clearBlockTopic(channelId: string, topicId: string): Promise<void>;
  clearBlockTag(channelId: string, topicId: string, tagId: string): Promise<void>;
  getBlockedTopics(): Promise<{ channelId: string, topicId: string }[]>;
  getBlockedTags(): Promise<{ channelId: string, topicId: string, tagId: string }[]>;

  getTopics(channelId: string): Promise<Topic[]>;
  getMoreTopics(channelId: string): Promise<Topic[]>;
  getTags(channelId: string, topicId: string): Promise<Tag[]>;
  getMoreTags(channelId: string, topicId: string): Promise<Tag[]>;

  setUnreadChannel(channelId: string): Promise<void>;
  clearUnreadChannel(channelId: string): Promise<void>;

  addRepeaterAccess(channelId: string, name: string): Promise<Repeater>;
  removeRepeaterAccess(channelId: string, repeaterId: string): Promise<void>;

  addChannelListener(ev: (channels: Channel[]) => void): void;
  removeChannelListener(ev: (channels: Channel[]) => void): void;
}

export interface Stream {
  addChannelListener(ev: (channels: Channel[]) => void): void;
  removeChannelListener(ev: (channels: Channel[]) => void): void;
}

export interface Focus {
  blur(): void;

  addTopic(type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(topicId: string): Promise<void>;
  setTopicSubject(topicId: string, subject: string): Promise<void>;
  addTag(topicId: string, type: string, subject: string): Promise<string>;
  removeTag(cardId: string, tagId: string): Promise<void>;
  setTagSubject(topicId: string, tagId: string, subject: string): Promise<void>;

  viewMoreTopics(): Promise<void>;
  viewMoreTags(topicId: string): Promise<void>;

  setUnreadChannel(cardId: string, channelId: string): Promise<void>;
  clearUnreadChannel(cardId: string, channelId: string): Promise<void>;

  getTopicAssetUrl(topicId: string, assetId: string): string;

  addRepeaterAccess(name: string): Promise<Repeater>;
  removeRepeaterAccess(repeaterId: string): Promise<void>;

  flagTopic(topicId: string): Promise<void>;
  flagTag(topicId: string, tagId: string): Promise<void>;
  setBlockTopic(topicId: string): Promise<void>;
  setBlockTag(topicId: string, tagId: string): Promise<void>;
  clearBlockTopic(topicId: string): Promise<void>;
  clearBlockTag(topicId: string, tagId: string): Promise<void>;

  addTopicListener(ev: (topics: Topic[]) => void): void;
  removeTopicListener(ev: (topics: Topic[]) => void): void;
}

export interface Node {
  getAccounts(): Promise<NodeAccount[]>;
  createAccountAccess(): Promise<string>;
  resetAccountAccess(): Promise<string>;
  blockAccount(flag: boolean): Promise<void>;
  removeAccount(accountId: number): Promise<void>;
  getConfig(): Promise<NodeConfig>;
  setConfig(config: NodeConfig): Promise<void>;
}

export interface Bot {
  addTopic(type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(topicId: string): Promise<void>;
  addTag(topicId: string, type: string, value: string): Promise<string>;
  removeTag(topicId: string, tagId: string): Promise<void>;
}

