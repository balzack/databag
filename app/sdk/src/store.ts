import { WebStore, SqlStore } from './api';
import { Login, ProfileEntity, defaultProfileEntity } from './entities';
import type { Logging } from './logging';

export interface Store {
  init(): Promise<Login | null>;
  setLogin(login: Login): Promise<void>;
  clearLogin(): Promise<void>;

  getProfileRevision(guid: string): Promise<number>;
  setProfileRevision(guid: string, revision: number): Promise<void>;
  getProfileData(guid: string): Promise<ProfileEntity>;
  setProfileData(guid: string, data: ProfileEntity): Promise<void>;
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

  private async setAppValue(guid: string, id: string, value: string): Promise<void> {
    await this.sql.set('INSERT OR REPLACE INTO app (key, value) values (?, ?)', [`${guid}::${id}`, value]);
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
    await this.setAppValue('', 'login', JSON.stringify(login));
  }

  public async clearLogin(): Promise<void> {
    await this.clearAppValue('', 'login');
  }

  public async getProfileRevision(guid: string): Promise<number> {
    return await this.getAppValue(guid, 'profile_revision', 0) as number;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {
console.log(">> SET PROFILE REVISION: ", revision);
    await this.setAppValue(guid, 'profile_revision', revision.toString());
  } 
  
  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return await this.getAppValue(guid, 'profile_data', defaultProfileEntity) as ProfileEntity;
  }
  
  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {
    await this.setAppValue(guid, 'profile_data', JSON.stringify(data));
  }
}

export class OnlineStore implements Store {

  private web: WebStore;
  private log: Logging;

  constructor(log: Logging, web: WebStore) {
    this.web = web;
    this.log = log;
  }

  private async getAppValue(id: string, unset: any): Promise<any> {
    const value =  await this.web.getValue(id);
    if (value != null) {
      return JSON.parse(value);
    }
    return unset;
  }

  public async init(): Promise<Login | null> {
    return this.getAppValue('login', null);
  }

  public async setLogin(login: Login): Promise<void> {
    return await this.web.setValue('login', JSON.stringify(login));
  }

  public async clearLogin(): Promise<void> {
    return await this.web.clearValue('login');
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
}

