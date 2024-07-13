import { EventEmitter } from 'eventemitter3';
import type { Account, Logging } from './api';
import type { AccountStatus } from './types';
import { Store } from './store';

export class AccountModule implements Account {

  private emitter: EventEmitter;
  private token: string;
  private node: string;
  private secure: boolean;
  private log: Logging;

  constructor(log: Logging, store: Store, token: string, node: string, secure: boolean) {
    this.log = log;
    this.emitter = new EventEmitter();
    this.token = token;
    this.node = node;
    this.secure = secure;
  }

  public addStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.off('status', ev);
  }

  public close(): void {
  }

  public async setRevision(rev: number): Promise<void> {
    console.log('set account revision:', rev);
  }

  public async enableNotifications(): Promise<void> {
  }

  public async disableNotifications(): Promise<void> {
  }

  public async enableRegistry(): Promise<void> {
  }

  public async disableRegistry(): Promise<void> {
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

