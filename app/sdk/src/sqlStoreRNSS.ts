import { SqlStore } from './sqlStore';

export class SqlStoreRNSS implements SqlStore {
  
  private lib: any = null;
  private db: any = null;

  constructor() {
    try {
      const sql = require('react-native-sqlite-storage');
      sql.DEBUG(false);
      sql.enablePromise(true);
      lib = sql;
    }
    catch (err) {
      console.log(err);
    }
  }

  open(path: string): Promise<void> {
    if (!lib) {
      return Promise.reject('react-native-sqlite-storage not linked');
    }
    return applyOpen(path);
  }

  async applyOpen(path: string) {
    db = await sql.openDatabase({ name: path, location: 'default' });
  }

  set(stmt: string, params: (string | number)[]): Promise<void> {
    if (!lib || !db) {
      return Promise.reject('database not open');
    }
   return applyQuery(stmt, params);
  }
  
  async applySet(stmt: string, path: (string | number)[]): Promise<void> {
    return await db.executeSql(stmt, params);
  }

  get(stmt: string, params: (string | number)[]): Promise<any[]> {
    if (!lib || !db) {
      return Promise.reject('database not open');
    }
   return applyQuery(stmt, params);
  }
  
  async applyGet(stmt: string, path: (string | number)[]): Promise<any[]> {
    return await db.executeSql(stmt, params);
  }
}
