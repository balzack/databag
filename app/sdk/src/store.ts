import { WebStore, SqlStore, Logging } from './api';
import { Login } from './entities';

export interface Store {
  init(): Promise<Login | null>;
}

export class OfflineStore implements Store {

  private sql: SqlStore;
  private log: Logging;

  constructor(log: Logging, sql: SqlStore) {
    this.sql = sql;
    this.log = log;
  }

  private async getAppValue(id: string, unset: any): Promise<any> {
    const rows = await this.sql.get(`SELECT * FROM app WHERE key='${id}';`);
    if (rows.length == 1 && rows[0].value != null) {
      return JSON.parse(rows[0].value);
    }
    return unset;
  }

  public async init(): Promise<Login | null> {
    await this.sql.set("CREATE TABLE IF NOT EXISTS app (key text, value text, unique(key));");
    await this.sql.set("INSERT OR IGNORE INTO app (key, value) values ('session', null);");
    return await this.getAppValue('login', null);
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
    return await this.getAppValue('login', null);
  }
}

export class NoStore implements Store {
  constructor() {
  }

  public async init(): Promise<Login | null> {
    return null;
  }
}

