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

  addStatusListener(ev: (status: string) => void): void;
  removeStatusListener(ev: (status: string) => void): void;
}

export interface Node {
}

export interface Account {
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


