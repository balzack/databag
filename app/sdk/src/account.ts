import { EventEmitter } from 'eventemitter3';
import type { Account, Logging } from './api';
import type { AccountStatus } from './types';
import { Store } from './store';
import { defaultAccountEntity, AccountEntity } from './entities';
import { getAccountStatus } from './net/getAccountStatus';

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class AccountModule implements Account {

  private emitter: EventEmitter;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private log: Logging;
  private syncing: boolean;
  private closing: boolean;
  private revision: number;
  private nextRevision: number | null;
  private entity: AccountEntity;

  constructor(log: Logging, store: Store, guid: string, token: string, node: string, secure: boolean) {
    this.log = log;
    this.emitter = new EventEmitter();
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.revision = 0;
    this.entity = defaultAccountEntity;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();    
  }

  private async init() {
    this.revision = await this.store.getAccountRevision(this.guid);
    this.entity = await this.store.getAccountData(this.guid);
    this.syncing = false;
    await this.sync();
  }

  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      while (this.nextRevision && !this.closing) {
        if (this.revision == this.nextRevision) {
          this.nextRevision = null;
        }
        else {
          const nextRev = this.nextRevision;
          try {
            const { guid, node, secure, token } = this;
            const status = await getAccountStatus(node, secure, token);
            await this.store.setAccountStatus(guid, status);
            await this.store.setAccountRevision(guid, nextRev);
            this.entity = status;
            this.emitter.emit('status', this.getStatus());
            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`account revision: ${nextRev}`);
          }
          catch (err) {
            this.log.warn(err);
            await new Promise(r => setTimeout(r, RETRY_POLL_MS));
          } 
        }
      }
    }
  }

  public getStatus() {
    const { storageUsed, storageAvailable, forwardingAddress, searchable, allowUnseaed, pushEnabled, sealable, seal, enableIce, multiFactorAuth, webPushKey } = this.entity;
    return { storageUsed, storageAvailable, forwardingAddress, searchable, allowUnsealed, pushEnabled, sealable, sealSet: Boolean(seal), enableIce, multiFactorAuth, webPushKey };
  }

  public addStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.on('status', ev);
    this.emitter.emit('status', this.getStatus());
  }

  public removeStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.off('status', ev);
  }

  public async close(): void {
    this.closing = true;
    while(this.syncing) {
      await new Promise(r => setTimeout(r, CLOSE_POLL_MS));
    }
  }

  public async setRevision(rev: number): Promise<void> {
    this.nextRevision = rev;
    await this.sync();
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

