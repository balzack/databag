import { SqlStore } from './index';
import { WebStore } from './index';

export class AccountSession {

  private sqlStore: SqlStore | null = null;
  private webStore: WebStore | null = null;

  constructor(sql: SqlStore | null, web: WebStore | null) {
    this.sqlStore = sql;
    this.webStore = web;
  }

}
