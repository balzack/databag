import { SqlStore } from './sqlStore';

export class SqlStoreBS implements SqlStore {
  
  private lib: any = null;
  private db: any = null;

  constructor() {
    try {
      const sql = require('better-sqlite3');
      lib = sql;
    }
    catch (err) {
      console.log(err);
    }
  }

  open(path: string): Promise<void> {
    if (!lib) {
      return Promise.reject('better-sqlite3 not linked');
    }
    db = new lib(path, {});
    return Promise.resolve();
  }

  set(stmd: string, params: (string | number)[]): Promise<void> {
    if (!lib || !db) {
      return Promise.reject('database not open');
    }
    const cmd = db.prepare(stmt);
    db.transation(() => {
      cmd.run(...params);
    })
    return Promise.resolve();
  }

  get(stmt: string, params: (string | number)[]): Promise<any[]> {
    if (!lib || !db) {
      return Promise.reject('database not open');
    }
    const cmd = db.prepare(stmt);
    const rows = cmd.all(...params);
    return Promise.resolve(rows);
  }
}
