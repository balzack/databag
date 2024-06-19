import { AccountSession } from './accountSession';
import { AdminSession } from './adminSession';

export class DatabagSDK {
  
  constructor() {
    console.log("databag sdk");
  }

  public async initSqlStore(path: string): Promise<AccountSession | null> {
    return new AccountSession();
  }

  public async initWebStore(): Promise<AccountSession | null> {
    return new AccountSession();
  }

  public async initMemStore(): Promise<AccountSession | null> {
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

  public async adminLogout(): Promise<void> {
  }
}

