import { EventEmitter } from 'eventemitter3';
import { type Account } from '../src/api';
import type { AccountStatus } from '../src/types';

export class MockAccountModule implements Account {

  public revision: number;
  private emitter: EventEmitter;

  constructor() {
    this.revision = 0;
    this.emitter = new EventEmitter();
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
    this.revision = rev;
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

