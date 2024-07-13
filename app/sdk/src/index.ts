import { SessionModule } from './session';
import { NodeModule } from './node';
import { BotModule } from './bot';
import { ConsoleLogging } from './logging';
import { type Store, OfflineStore, OnlineStore, NoStore } from './store';
import { setLogin } from './net/setLogin';
import { setAccess } from './net/setAccess';
import { addAccount } from './net/addAccount';
import type { Session, Node, Bot, SqlStore, WebStore, Crypto, Logging } from './api';
import type { SessionParams } from './types';
import type { Login } from './entities';

export * from './api';
export * from './types';

export class DatabagSDK {

  private log: Logging;
  private crypto: Crypto | null;
  private store: Store;

  constructor(crypto: Crypto | null, log: Logging | null) {
    this.crypto = crypto;
    this.store = new NoStore();
    this.log = log ? log : new ConsoleLogging();
    this.log.info("databag sdk");
  }

  public async initOfflineStore(sql: SqlStore): Promise<Session | null> {
    this.store = new OfflineStore(this.log, sql);
    const login = await this.store.init();
    return login ? new SessionModule(this.store, this.crypto, this.log, login.token, login.url, login.timestamp) : null
  }

  public async initOnlineStore(web: WebStore): Promise<Session | null> {
    this.store = new OnlineStore(this.log, web);
    const login = await this.store.init();
    return login ? new SessionModule(this.store, this.crypto, this.log, login.token, login.url, login.timestamp) : null
  }

  public async login(handle: string, password: string, url: string, mfaCode: string | null, params: SessionParams): Promise<Session> {
    const { appName, version, deviceId, deviceToken, pushType, notifications } = params;
    const { guid, appToken, created, pushSupported } = await setLogin(url, handle, password, mfaCode, appName, version, deviceId, deviceToken, pushType, notifications);
    const login: Login = { guid, url, token: appToken, timestamp: created, pushSupported };
    await this.store.setLogin(login);
    return new SessionModule(this.store, this.crypto, this.log, appToken, url, created);
  }

  public async access(url: string, token: string, params: SessionParams): Promise<Session> {
    const { appName, version, deviceId, deviceToken, pushType, notifications } = params;
    const { guid, appToken, created, pushSupported } = await setAccess(url, token, appName, version, deviceId, deviceToken, pushType, notifications);
    const login: Login = { guid, url, token: appToken, timestamp: created, pushSupported };
    await this.store.setLogin(login);
    return new SessionModule(this.store, this.crypto, this.log, appToken, url, created);
  }

  public async create(handle: string, password: string, url: string, token: string | null, params: SessionParams): Promise<Session> {
    await addAccount(url, handle, password, token);
    const { appName, version, deviceId, deviceToken, pushType, notifications } = params;
    const { guid, appToken, created, pushSupported } = await setLogin(url, handle, password, null, appName, version, deviceId, deviceToken, pushType, notifications);
    const login: Login = { guid, url, token: appToken, timestamp: created, pushSupported };
    await this.store.setLogin(login);
    return new SessionModule(this.store, this.crypto, this.log, appToken, url, created);
  }

  public async logout(session: Session): Promise<void> {
    session.close();
  }

  public async configure(token: string, url: string, mfaCode: string | null): Promise<Node> {
    return new NodeModule(this.log, '', '');
  }

  public async automate(token: string, url: string) {
    return new BotModule(this.log, token, url);
  }
}
