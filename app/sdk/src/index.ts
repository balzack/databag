import { type User, UserModule } from './user';
import { type Admin, AdminModule } from './admin';

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

export class DatabagSDK {

  private store: SqlStore | WebStore | null = null;

  constructor() {
    console.log("databag sdk");
  }

  public async initOfflineStore(sql: SqlStore): Promise<User | null> {
    this.store = sql;
    // initialize
    return new UserModule(this.store, '', '');
  }

  public async initOnlineStore(web: WebStore): Promise<User | null> {
    this.store = web;
    // initialize
    return new UserModule(this.store, '', '');
  }

  public async userLogin(handle: string, password: string, url: string): Promise<User> {
    return new UserModule(this.store, '', '');
  }

  public async userAccess(token: string, url: string): Promise<User> {
    return new UserModule(this.store, '', '');
  }

  public async userCreate(handle: string, password: string, url: string, token: string): Promise<User> {
    return new UserModule(this.store, '', '');
  }

  public async userLogout(session: User): Promise<void> {
  }

  public async adminLogin(token: string, url: string): Promise<Admin> {
    return new AdminModule('', '');
  }

  public async adminLogout(session: Admin): Promise<void> {
  }
}
