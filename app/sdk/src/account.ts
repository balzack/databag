import { EventEmitter } from 'events';
import { type Account } from './api';
import type { AccountStatus } from './types';

export class AccountModule implements Account {

  private emitter: EventEmitter;
  private sync: (flag: boolean) => void;
  private token: string;
  private url: string;

  constructor(token: string, url: string, sync: (flag: boolean) => void) {
    this.emitter = new EventEmitter();
    this.token = token;
    this.url = url;
    this.sync = sync;
  }

  public addStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.off('status', ev);
  }

  public async setRevision(rev: number): Promise<void> {
  }

  public async resync(): Promise<void> {
  }

  public async setNotifications(flag: boolean): Promise<void> {
  }

  public async setSearchable(flag: boolean): Promise<void> {
  }

  public async enableMFA(): Promise<{ secretImage: string, secretText: string }> {
    return { secretImage: '', secretText: '' };
  }

  public async disableMFA(): Promise<void> {
  }

  public async confirmMFA(code: string): Promise<void> {
  }

  public async setAccountSeal(password: string): Promise<void> {
  }

  public async clearAccountSeal(): Promise<void> {
  }

  public async unlockAccountSeal(password: string): Promise<void> {
  }

  public async setLogin(username: string, password: string): Promise<void> {
  }
}

