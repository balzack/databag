import { EventEmitter } from 'events';

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
  getGroup(): Group;
  getAttribute(): Attribute;
  getContent(): Content;

  resync(): void;
  addStatusListener(ev: (status: string) => void): void;
  removeStatusListener(ev: (status: string) => void): void;
}

export interface Node {
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
}

export interface Group {
}

export interface Attribute {
}

export interface Content {
  addChannel(type: string, subject: string, cardIds: string[]): Promise<string>;
  removeChannel(channelId: string): Promise<void>;
  setChannelSubject(channelId: string, type: string, subject: string): Promise<void>;
  setChannelCard(channelId: string, cardId: string): Promise<void>;
  clearChannelCard(channelId: string, cardId: string): Promise<void>;
  addTopic(channelId: string, type: string, message: string, assets: Asset[]): Promise<string>;
  removeTopic(channelId: string, topicId: string): Promise<void>;
  setTopicSubject(channelId: string, topicId: string, type: string, subject: string): Promise<void>;
  getTopicAssetUrl(channelId: string, topicId: string, assetId: string): string;
  getTopics(channelId: string, revision: number, count: number, begin: number, end: number): Promise<Topic[]>;
  getTopic(channelId: string, topicId: string): Promise<Topic>;

  addChannelListener(ev: (channels: Channel[]) => void): void;
  removeChannelListener(ev: (channels: Channel[]) => void): void;
}

export interface SealKey {
  publicKey: string;
  privateKey: string;
}

export interface Seal {
  passwordSalt: string;
  privateKeyIv: string;
  privateKeyEncrypted: string;
  publicKey: string;
}

export interface AccountStatus {
  disabled: boolean;
  storageUsed: number;
  storageAvailable: number;
  forwardingAddress: string;
  searchable: boolean;
  allowUnsealed: boolean;
  pushEnabled: boolean;
  sealable: boolean;
  seal: Seal;
  enableIce: boolean;
  multiFactorAuth: boolean;
  webPushKey: string;
}

export interface Profile {
  guid: string;
  handle: string;
  name: string;
  description: string;
  location: string;
  image: string;
  revision: number;
  seal: string;
  version: string;
  node: string;
}

export interface Card {
}

export interface Channel {
}

export interface Topic {
}

export interface Asset {
}
