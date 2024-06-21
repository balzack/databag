import { AccountSession } from './accountSession';
import { AdminSession } from './adminSession';

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

  private sqlStore: SqlStore | null = null;
  private webStore: WebStore | null = null;  

  constructor() {
    console.log("databag sdk");
  }

  public async initOfflineStore(sql: SqlStore): Promise<AccountSession | null> {
    this.sqlStore = sql;
    // initialize
    return new AccountSession(this.sqlStore, this.webStore);
  }

  public async initOnlineStore(web: WebStore): Promise<AccountSession | null> {
    this.webStore = web;
    // initialize
    return new AccountSession(this.sqlStore, this.webStore);
  }

  public async accountLogin(): Promise<AccountSession> {
    return new AccountSession(this.sqlStore, this.webStore);
  }

  public async accountAccess(): Promise<AccountSession> {
    return new AccountSession(this.sqlStore, this.webStore);
  }

  public async accountCreate(): Promise<AccountSession> {
    return new AccountSession(this.sqlStore, this.webStore);
  }

  public async accountLogout(session: AccountSession): Promise<void> {
  }

  public async adminLogin(): Promise<AdminSession> {
    return new AdminSession();
  }

  public async adminLogout(session: AdminSession): Promise<void> {
  }
}
