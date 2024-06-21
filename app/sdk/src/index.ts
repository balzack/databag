import { AccountSession } from './accountSession';
import { AdminSession } from './adminSession';
import { SqlStore } from './sqlStore';
import { WebStore } from './webStore';

export class DatabagSDK {
  
  constructor() {
    console.log("databag sdk");
  }

  public async initOfflineStore(store: SqlStore): Promise<AccountSession | null> {
    return new AccountSession();
  }

  public async initOnlineStore(store: WebStore): Promise<AccountSession | null> {
    return new AccountSession();
  }

  public async accountLogin(): Promise<AccountSession> {
    return new AccountSession();
  }

  public async accountAccess(): Promise<AccountSession> {
    return new AccountSession();
  }

  public async accountCreate(): Promise<AccountSession> {
    return new AccountSession();
  }

  public async accountLogout(session: AccountSession): Promise<void> {
  }

  public async adminLogin(): Promise<AdminSession> {
    return new AdminSession();
  }

  public async adminLogout(session: AdminSession): Promise<void> {
  }
}

