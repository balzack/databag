import { SessionModule } from './session';
import { NodeModule } from './node';

import { type Session, type Node, type SqlStore, type WebStore } from './types';

export class DatabagSDK {

  private store: SqlStore | WebStore | null = null;

  constructor() {
    console.log("databag sdk");
  }

  public async initOfflineStore(sql: SqlStore): Promise<Session | null> {
    this.store = sql;
    // initialize
    return new SessionModule(this.store, '', '');
  }

  public async initOnlineStore(web: WebStore): Promise<Session | null> {
    this.store = web;
    // initialize
    return new SessionModule(this.store, '', '');
  }

  public async login(handle: string, password: string, url: string): Promise<Session> {
    return new SessionModule(this.store, '', '');
  }

  public async access(token: string, url: string): Promise<Session> {
    return new SessionModule(this.store, '', '');
  }

  public async create(handle: string, password: string, url: string, token: string): Promise<Session> {
    return new SessionModule(this.store, '', '');
  }

  public async logout(session: Session): Promise<void> {
  }

  public async configure(token: string, url: string): Promise<Node> {
    return new NodeModule('', '');
  }
}
