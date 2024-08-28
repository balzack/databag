import { WebStore, SqlStore } from './api';
import { Login, ProfileEntity, defaultProfileEntity, AccountEntity, defaultAccountEntity } from './entities';
import type { Logging } from './logging';

export interface Store {
  init(): Promise<Login | null>;
  setLogin(login: Login): Promise<void>;
  clearLogin(): Promise<void>;
  getSeal(guid: string): Promise<{ publicKey: string, privateKey: string } | null>;
  setSeal(guid: string, seal: { publicKey: string, privateKey: string }): Promise<void>;
  clearSeal(guid: string): Promise<void>;

  getProfileRevision(guid: string): Promise<number>;
  setProfileRevision(guid: string, revision: number): Promise<void>;
  getProfileData(guid: string): Promise<ProfileEntity>;
  setProfileData(guid: string, data: ProfileEntity): Promise<void>;

  getAccountRevision(guid: string): Promise<number>;
  setAccountRevision(guid: string, revision: number): Promise<void>;
  getAccountData(guid: string): Promise<AccountEntity>;
  setAccountData(guid: string, data: AccountEntity): Promise<void>;
}

export class OfflineStore implements Store {

  private sql: SqlStore;
  private log: Logging;

  constructor(log: Logging, sql: SqlStore) {
    this.sql = sql;
    this.log = log;
  }

  private async getAppValue(guid: string, id: string, unset: any): Promise<any> {
    try {
      const rows = await this.sql.get(`SELECT * FROM app WHERE key='${guid}::${id}';`);
      if (rows.length == 1 && rows[0].value != null) {
        return JSON.parse(rows[0].value);
      }
    }
    catch(err) {
      console.log(err);
    }
    return unset;
  }

  private async setAppValue(guid: string, id: string, value: any): Promise<void> {
    await this.sql.set('INSERT OR REPLACE INTO app (key, value) values (?, ?)', [`${guid}::${id}`, JSON.stringify(value)]);
  }

  private async clearAppValue(guid: string, id: string): Promise<void> {
    await this.sql.set('INSERT OR REPLACE INTO app (key, value) values (?, null)', [`${guid}::${id}`]);
  }

  private async initLogin(guid: string): Promise<void> {
    await this.sql.set(`CREATE TABLE IF NOT EXISTS channel_${guid} (channel_id text, revision integer, detail_revision integer, topic_revision integer, topic_marker integer, blocked integer, sync_revision integer, detail text, unsealed_detail text, summary text, unsealed_summary text, offsync integer, read_revision integer, unique(channel_id))`);
    await this.sql.set(`CREATE TABLE IF NOT EXISTS channel_topic_${guid} (channel_id text, topic_id text, revision integer, created integer, detail_revision integer, blocked integer, detail text, unsealed_detail text, unique(channel_id, topic_id))`);
    await this.sql.set(`CREATE TABLE IF NOT EXISTS card_${guid} (card_id text, revision integer, detail_revision integer, profile_revision integer, detail text, profile text, notified_view integer, notified_article integer, notified_profile integer, notified_channel integer, offsync integer, blocked integer, unique(card_id))`);
    await this.sql.set(`CREATE TABLE IF NOT EXISTS card_channel_${guid} (card_id text, channel_id text, revision integer, detail_revision integer, topic_revision integer, topic_marker integer, sync_revision integer, detail text, unsealed_detail text, summary text, unsealed_summary text, offsync integer, blocked integer, read_revision integer, unique(card_id, channel_id))`);
    await this.sql.set(`CREATE TABLE IF NOT EXISTS card_channel_topic_${guid} (card_id text, channel_id text, topic_id text, revision integer, created integer, detail_revision integer, blocked integer, detail text, unsealed_detail text, unique(card_id, channel_id, topic_id))`);
  }

  public async init(): Promise<Login | null> {
    await this.sql.set("CREATE TABLE IF NOT EXISTS app (key text, value text, unique(key));");
    return await this.getAppValue('', 'login', null) as Login | null;
  }

  public async setLogin(login: Login): Promise<void> {
    await this.initLogin(login.guid);
    await this.setAppValue('', 'login', login);
  }

  public async clearLogin(): Promise<void> {
    await this.clearAppValue('', 'login');
  }

  public async getSeal(guid: string): Promise<{ publicKey: string, privateKey: string } | null> {
    return await this.getAppValue(guid, 'seal', null) as { publicKey: string, privateKey: string } | null;
  }

  public async setSeal(guid: string, seal: { publicKey: string, privateKey: string }): Promise<void> {
    await this.setAppValue(guid, 'seal', seal);
  }

  public async clearSeal(guid: string): Promise<void> {
    await this.clearAppValue(guid, 'seal');
  }

  public async getProfileRevision(guid: string): Promise<number> {
    return await this.getAppValue(guid, 'profile_revision', 0) as number;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {
    await this.setAppValue(guid, 'profile_revision', revision.toString());
  } 
  
  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return await this.getAppValue(guid, 'profile_data', defaultProfileEntity) as ProfileEntity;
  }
  
  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {
    await this.setAppValue(guid, 'profile_data', JSON.stringify(data));
  }

  public async getAccountRevision(guid: string): Promise<number> {
    return await this.getAppValue(guid, 'account_revision', 0) as number;
  }

  public async setAccountRevision(guid: string, revision: number): Promise<void> {
    await this.setAppValue(guid, 'account_revision', revision.toString());
  } 
  
  public async getAccountData(guid: string): Promise<AccountEntity> {
    return await this.getAppValue(guid, 'account_data', defaultAccountEntity) as AccountEntity;
  }
  
  public async setAccountData(guid: string, data: AccountEntity): Promise<void> {
    await this.setAppValue(guid, 'account_data', JSON.stringify(data));
  }

}

export class OnlineStore implements Store {

  private web: WebStore;
  private log: Logging;

  constructor(log: Logging, web: WebStore) {
    this.web = web;
    this.log = log;
  }

  private async getAppValue(guid: string, id: string, unset: any): Promise<any> {
    const value =  await this.web.getValue(`${guid}::${id}`);
    if (value != null) {
      return JSON.parse(value);
    }
    return unset;
  }

  private async setAppValue(guid: string, id: string, value: any): Promise<void> {
    await this.web.setValue(`${guid}::${id}`, JSON.stringify(value));
  }

  private async clearAppValue(guid: string, id: string): Promise<void> {
    await this.web.clearValue(`${guid}::${id}`);
  } 

  public async init(): Promise<Login | null> {
    return await this.getAppValue('', 'login', null) as Login | null;
  }

  public async setLogin(login: Login): Promise<void> {
    await this.setAppValue('', 'login', login);
  }

  public async clearLogin(): Promise<void> {
    await this.clearAppValue('', 'login');
  }

  public async getSeal(guid: string): Promise<{ publicKey: string, privateKey: string } | null> {
    return await this.getAppValue(guid, 'seal', null) as { publicKey: string, privateKey: string } | null;
  }

  public async setSeal(guid: string, seal: { publicKey: string, privateKey: string }): Promise<void> {
    await this.setAppValue(guid, 'seal', seal);
  }

  public async clearSeal(guid: string): Promise<void> {
    await this.clearAppValue(guid, 'seal');
  }

  public async getProfileRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {
  } 
  
  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return defaultProfileEntity;
  }
  
  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {
  } 

  public async getAccountRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setAccountRevision(guid: string, revision: number): Promise<void> {
  } 
  
  public async getAccountData(guid: string): Promise<AccountEntity> {
    return defaultAccountEntity;
  }
  
  public async setAccountData(guid: string, data: AccountEntity): Promise<void> {
  } 

}

export class NoStore implements Store {
  constructor() {
  }

  public async init(): Promise<Login | null> {
    return null;
  }

  public async setLogin(login: Login): Promise<void> {
  }

  public async clearLogin(): Promise<void> {
  }

  public async getSeal(guid: string): Promise<{ publicKey: string, privateKey: string } | null> {
    return null;
  }

  public async setSeal(guid: string, seal: { publicKey: string, privateKey: string }): Promise<void> {
  }

  public async clearSeal(guid: string): Promise<void> {
  }
  
  public async getProfileRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {
  }

  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return defaultProfileEntity;
  }

  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {
  }

  public async getAccountRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setAccountRevision(guid: string, revision: number): Promise<void> {
  }

  public async getAccountData(guid: string): Promise<AccountEntity> {
    return defaultAccountEntity;
  }

  public async setAccountData(guid: string, data: AccountEntity): Promise<void> {
  }

}

