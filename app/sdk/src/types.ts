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
  getProfile(): Profile;
  getContact(): Contact;
  getGroup(): Group;
  getAttribute(): Attribute;
  getChannel(): Channel;

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

export interface Profile {
}

export interface Contact {
}

export interface Group {
}

export interface Attribute {
}

export interface Channel {
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

