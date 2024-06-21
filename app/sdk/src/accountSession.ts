import { SqlStore } from './databagSdk';
import { WebStore } from './databagSdk';

export class AccountSession {

  private sqlStore: SqlStore | null = null;
  private webStore: WebStore | null = null;

  constructor(sql: SqlStore | null, web: WebStore | null) {
    this.sqlStore = sql;
    this.webStore = web;
  }

}
