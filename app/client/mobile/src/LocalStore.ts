import {SqlStore} from 'databag-client-sdk';
import SQLite from 'react-native-sqlite-storage';

export class LocalStore implements SqlStore {
  private db: any = null;

  constructor() {
    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
  }

  public async open(path: string) {
    this.db = await SQLite.openDatabase({name: path, location: 'default'});
    await this.localStoreSet(
      'CREATE TABLE IF NOT EXISTS local_store (key text, value text, unique(key));',
    );
  }

  public async get(key: string, value: string, unset: string): Promise<string> {
    try {
      const rows = await this.localStoreGet(
        `SELECT * FROM local_store WHERE key='${key}';`,
      );
      if (rows.length == 1 && rows[0].value != null) {
        return rows[0].value;
      }
    } catch (err) {
      console.log(err);
    }
    return unset;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.localStoreSet(
      'INSERT OR REPLACE INTO local_store (key, value) values (?, ?)',
      [key, value],
    );
  }

  public async clear(key: string): Promise<void> {
    await this.localStoreSet(
      'INSERT OR REPLACE INTO local_store (key, value) values (?, null)',
      [key],
    );
  }

  private async localStoreSet(
    stmt: string,
    params: (string | number | null)[],
  ): Promise<void> {
    await this.db.executeSql(stmt, params);
  }

  private async localStoreGet(
    stmt: string,
    params: (string | number | null)[],
  ): Promise<any[]> {
    const res = await this.db.executeSql(stmt, params);
    const rows = [];
    if (res[0] && res[0].rows && res[0].rows.length > 0) {
      for (let i = 0; i < res[0].rows.length; i++) {
        rows.push(res[0].rows.item(i));
      }
    }
    return rows;
  }
}
