import { SessionModule } from './session';
import { NodeModule } from './node';
import { BotModule } from './bot';
import { ConsoleLogging } from './logging';

import type { Session, Node, Bot, SqlStore, WebStore, Crypto, Logging } from './api';
import type { SessionParams } from './types';

export * from './api';
export * from './types';

export class DatabagSDK {

  private logging: Logging;
  private crypto: Crypto | null;
  private store: SqlStore | WebStore | null = null;

  constructor(crypto: Crypto | null, logging: Logging | null) {
    this.crypto = crypto;
    this.logging = logging ? logging : new ConsoleLogging();
    this.logging.info("databag sdk");
  }

  public async initOfflineStore(sql: SqlStore): Promise<Session | null> {
    this.store = sql;
    // initialize
    return new SessionModule(this.store, this.crypto, this.logging, '', '');
  }

  public async initOnlineStore(web: WebStore): Promise<Session | null> {
    this.store = web;
    // initialize
    return new SessionModule(this.store, this.crypto, this.logging, '', '');
  }

  public async login(handle: string, password: string, url: string, mfaCode: string | null, params: SessionParams): Promise<Session> {
    return new SessionModule(this.store, this.crypto, this.logging, '', '');
  }

  public async access(url: string, token: string, params: SessionParams): Promise<Session> {
    return new SessionModule(this.store, this.crypto, this.logging, '', '');
  }

  public async create(handle: string, password: string, url: string, token: string | null, params: SessionParams): Promise<Session> {
    return new SessionModule(this.store, this.crypto, this.logging, '', '');
  }

  public async logout(session: Session): Promise<void> {
    session.close();
  }

  public async configure(token: string, url: string, mfaCode: string | null): Promise<Node> {
    return new NodeModule(this.logging, '', '');
  }

  public async automate() {
    return new BotModule(this.logging);
  }
}
