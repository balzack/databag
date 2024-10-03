import { SessionModule } from './session';
import { NodeModule } from './node';
import { ContributorModule } from './contributor';
import { type Logging, ConsoleLogging } from './logging';
import { type Store, OfflineStore, OnlineStore, NoStore } from './store';
import { setLogin } from './net/setLogin';
import { clearLogin } from './net/clearLogin';
import { removeAccount } from './net/removeAccount';
import { setAccess } from './net/setAccess';
import { addAccount } from './net/addAccount';
import { setAdmin } from './net/setAdmin';
import { getAvailable } from './net/getAvailable';
import { getUsername } from './net/getUsername';
import type { Session, Node, Contributor } from './api';
import type { Params, SessionParams } from './types';
import type { Login } from './entities';
import type { Crypto } from './crypto';
import type { WebStore, SqlStore } from './store';

export * from './api';
export * from './types';
export { WebStore, SqlStore } from './store';
export { Crypto } from './crypto';

export class DatabagSDK {

  private log: Logging;
  private crypto: Crypto | null;
  private store: Store;
  private params: Params;

  constructor(params: Params, crypto?: Crypto, log?: Logging) {
    this.store = new NoStore();
    this.params = params;
    this.crypto = crypto ? crypto : null;
    this.log = log ? log : new ConsoleLogging();
    this.log.info("databag sdk");
  }

  public async initOfflineStore(sql: SqlStore): Promise<Session | null> {
    const { articleTypes, channelTypes } = this.params;
    this.store = new OfflineStore(this.log, sql);
    const login = await this.store.init();
    return login ? new SessionModule(this.store, this.crypto, this.log, login.guid, login.token, login.node, login.secure, login.timestamp, articleTypes, channelTypes) : null
  }

  public async initOnlineStore(web: WebStore): Promise<Session | null> {
    const { articleTypes, channelTypes } = this.params;
    this.store = new OnlineStore(this.log, web);
    const login = await this.store.init();
    return login ? new SessionModule(this.store, this.crypto, this.log, login.guid, login.token, login.node, login.secure, login.timestamp, articleTypes, channelTypes) : null
  }

  public async available(node: string, secure: boolean): Promise<number> {
    return await getAvailable(node, secure);
  }

  public async username(name: string, token: string, node: string, secure: boolean): Promise<boolean> {
    return await getUsername(name, token, null, node, secure);
  }

  public async login(handle: string, password: string, node: string, secure: boolean, mfaCode: string | null, params: SessionParams): Promise<Session> {
    const { articleTypes, channelTypes } = this.params;
    const { appName, version, deviceId, deviceToken, pushType, notifications } = params;
    const { guid, appToken, created, pushSupported } = await setLogin(node, secure, handle, password, mfaCode, appName, version, deviceId, deviceToken, pushType, notifications);
    const login: Login = { guid, node, secure, token: appToken, timestamp: created, pushSupported };
    await this.store.setLogin(login);
    return new SessionModule(this.store, this.crypto, this.log, guid, appToken, node, secure, created, articleTypes, channelTypes);
  }

  public async access(node: string, secure: boolean, token: string, params: SessionParams): Promise<Session> {
    const { articleTypes, channelTypes } = this.params;
    const { appName, version, deviceId, deviceToken, pushType, notifications } = params;
    const { guid, appToken, created, pushSupported } = await setAccess(node, secure, token, appName, version, deviceId, deviceToken, pushType, notifications);
    const login: Login = { guid, node, secure, token: appToken, timestamp: created, pushSupported };
    await this.store.setLogin(login);
    return new SessionModule(this.store, this.crypto, this.log, guid, appToken, node, secure, created, articleTypes, channelTypes);
  }

  public async create(handle: string, password: string, node: string, secure: boolean, token: string | null, params: SessionParams): Promise<Session> {
    const { articleTypes, channelTypes } = this.params;
    await addAccount(node, secure, handle, password, token);
    const { appName, version, deviceId, deviceToken, pushType, notifications } = params;
    const { guid, appToken, created, pushSupported } = await setLogin(node, secure, handle, password, null, appName, version, deviceId, deviceToken, pushType, notifications);
    const login: Login = { guid, node, secure, token: appToken, timestamp: created, pushSupported };
    await this.store.setLogin(login);
    return new SessionModule(this.store, this.crypto, this.log, guid, appToken, node, secure, created, articleTypes, channelTypes);
  }

  public async remove(session: Session): Promise<void> {
    const sessionModule = session as SessionModule;
    const { node, secure, token } = sessionModule.getParams();
    await removeAccount(node, secure, token);
    await sessionModule.close();
    try {
      await this.store.clearLogin();
    }
    catch(err) {
      this.log.error(err);
    }
  }

  public async logout(session: Session, all: boolean): Promise<void> {
    const sessionModule = session as SessionModule;
    const { node, secure, token } = sessionModule.getParams();
    await sessionModule.close();
    try {
      await this.store.clearLogin();
    }
    catch(err) {
      this.log.error(err);
    }
    clearLogin(node, secure, token, all).then(() => {}).catch(err => {
      console.log(err);
    });
  }

  public async configure(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<Node> {
    const access = await setAdmin(node, secure, token, mfaCode);
    return new NodeModule(this.log, node, secure, token);
  }

  public async automate(node: string, secure: boolean, token: string): Promise<Contributor> {
    return new ContributorModule(this.log, this.crypto, node, secure, token);
  }
}
