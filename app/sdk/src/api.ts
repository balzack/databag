// show group card comparison
// remove viewRevision
// add bot api
// formaize delete vs block remote channel

import type { Channel, Article, Group, Card, Profile, AccountStatus, NodeConfig, NodeAccount, Seal, SealKey, SignedMessage, ContactStatus, Asset, Topic } from './types';

export interface SqlStore {
  set(stmt: string, params: (string | number)[]): Promise<void>;
  get(stmt: string, params: (string | number)[]): Promise<any[]>;
}

export interface WebStore {
  getValue(key: string): Promise<string>;
  setValue(key: string, value: string): Promise<void>;
  clearValue(key: string): Promise<void>;
  clearAll(): Promise<void>;
}

export interface Session {
  getAccount(): Account;
  getIdentity(): Identity;
  getContact(): Contact;
  getAlias(): Alias;
  getAttribute(): Attribute;
  getContent(): Content;

  resync(): void;
  addStatusListener(ev: (status: string) => void): void;
  removeStatusListener(ev: (status: string) => void): void;
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

export interface Account {
  setNotifications(flag: boolean): Promise<void>;
  setSearchable(flag: boolean): Promise<void>;
  enableMFA(): Promise<void>;
  disableMFA(): Promise<void>;
  confirmMFA(): Promise<void>;
  setAccountSeal(seal: Seal, key: SealKey): Promise<void>
  unlockAccountSeal(key: SealKey): Promise<void>
  setLogin(username: string, password: string): Promise<void>

  addStatusListener(ev: (status: AccountStatus) => void): void;
  removeStatusListener(ev: (status: AccountStatus) => void): void;
}

export interface Identity {
  setProfileData(name: string, location: string, description: string): Promise<void>;
  setProfileImage(image: string): Promise<void>;
  getHandleStatus(handle: string): Promise<void>;

  addProfileListener(ev: (profile: Profile) => void): void;
  removeProfileListener(ev: (profile: Profile) => void): void;
}

export interface Contact {
  addCard(message: SignedMessage): Promise<string>;
  removeCard(cardId: string): Promise<void>;
  setCardConnecting(cardId: string): Promise<void>;
  setCardConnected(cardId: string, token: string, rev: number): Promise<void>;
  setCardConfirmed(cardId: string): Promise<void>;
  getCardOpenMessage(cardId: string): Promise<SignedMessage>;
  setCardOpenMessage(server: string, message: SignedMessage): Promise<ContactStatus>;
  getCardCloseMessage(cardId: string): Promise<SignedMessage>;
  setCardCloseMessage(server: string, message: SignedMessage): Promise<void>;
  removeChannel(cardId: string, channelId: string): Promise<void>;
  addTopic(cardId: string, channelId: string, type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(cardId: string, channelId: string, topicId: string): Promise<void>;
  setTopicSubject(cardId: string, channelId: string, topicId: string, type: string, subject: string): Promise<void>;
  getTopics(cardId: string, channelId: string, revision: number, count: number, begin: number, end: number): Promise<void>;
  getTopic(cardId: string, channelId: string, topicId: string): Promise<Topic>;
  resyncCard(cardId: string): Promise<void>;
  getTopicAssetUrl(cardId: string, channelId: string, topicId: string, assetId: string): string;
  getCardImageUrl(cardId: string): string;

  addCardListener(ev: (cards: Card[]) => void): void;
  removeCardListener(ev: (cards: Card[]) => void): void;
}

export interface Alias {
  addGroup(name: string, cardIds: string[]): Promise<string>;
  removeGroup(groupId: string): Promise<void>;
  setGroupName(groupId: string, name: string): Promise<void>;
  setGroupCard(groupId: string, cardId: string): Promise<void>;
  clearGroupCard(groupId: string, cardId: string): Promise<void>;
  compare(groupIds: string[], cardIds: string[]): Promise<Map<string, string[]>>;
  
  addGroupListener(ev: (groups: Group[]) => void): void;
  removeGroupListener(ev: (groups: Group[]) => void): void;
}

export interface Attribute {
  addArticle(type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string>;
  removeArticle(articleId: string): Promise<void>;
  setArticleSubject(articleId: string, type: string, subject: string): Promise<void>;
  setArticleCard(articleId: string, cardId: string): Promise<void>;
  clearArticleCard(articleId: string, cardId: string): Promise<void>;
  setArticleGroup(articleId: string, groupId: string): Promise<void>;
  clearArticleGroup(articleId: string, groupId: string): Promise<void>;

  addArticleListener(ev: (articles: Article[]) => void): void;
  removeArticleListener(ev: (articles: Article[]) => void): void;
}

export interface Content {
  addChannel(type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string>;
  removeChannel(channelId: string): Promise<void>;
  setChannelSubject(channelId: string, type: string, subject: string): Promise<void>;
  setChannelCard(channelId: string, cardId: string): Promise<void>;
  clearChannelCard(channelId: string, cardId: string): Promise<void>;
  setChannelGroup(channelId: string, cardId: string): Promise<void>;
  clearChannelGroup(channelId: string, cardId: string): Promise<void>;
  addTopic(channelId: string, type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(channelId: string, topicId: string): Promise<void>;
  setTopicSubject(channelId: string, topicId: string, type: string, subject: string): Promise<void>;
  getTopics(channelId: string, revision: number, count: number, begin: number, end: number): Promise<Topic[]>;
  getTopic(channelId: string, topicId: string): Promise<Topic>;
  getTopicAssetUrl(channelId: string, topicId: string, assetId: string): string;

  addChannelListener(ev: (channels: Channel[]) => void): void;
  removeChannelListener(ev: (channels: Channel[]) => void): void;
}

