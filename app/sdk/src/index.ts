import { SessionModule } from './session';
import { NodeModule } from './node';
import { BotModule } from './bot';

import type { Session, Node, Bot, SqlStore, WebStore } from './api';
import type { SessionParams } from './types';

export * from './api';
export * from './types';

export class DatabagSDK {

  private crypto: Crypto | null;
  private store: SqlStore | WebStore | null = null;

  constructor(crypto: Crypto | null) {
    console.log("databag sdk");
    this.crypto = crypto;
  }

  public async initOfflineStore(sql: SqlStore): Promise<Session | null> {
    this.store = sql;
    // initialize
    return new SessionModule(this.store, this.crypto, '', '');
  }

  public async initOnlineStore(web: WebStore): Promise<Session | null> {
    this.store = web;
    // initialize
    return new SessionModule(this.store, this.crypto, '', '');
  }

  public async login(handle: string, password: string, url: string, params: SessionParams): Promise<Session> {
    return new SessionModule(this.store, this.crypto, '', '');
  }

  public async access(token: string, url: string, params: SessionParams): Promise<Session> {
    return new SessionModule(this.store, this.crypto, '', '');
  }

  public async create(handle: string, password: string, url: string, token: string, params: SessionParams): Promise<Session> {
    return new SessionModule(this.store, this.crypto, '', '');
  }

  public async logout(session: Session): Promise<void> {
    session.close();
  }

  public async configure(token: string, url: string): Promise<Node> {
    return new NodeModule('', '');
  }

  public async automate() {
    return new BotModule();
  }
}
