import { EventEmitter } from 'eventemitter3';
import type { Account } from './api';
import type { AccountStatus } from './types';
import { Store } from './store';
import { Crypto } from './crypto';
import { Logging } from './logging';
import { defaultAccountEntity, AccountEntity } from './entities';
import { getAccountStatus } from './net/getAccountStatus';
import { addAccountMFAuth } from './net/addAccountMFAuth';
import { setAccountMFAuth } from './net/setAccountMFAuth';
import { removeAccountMFAuth } from './net/removeAccountMFAuth';
import { setAccountLogin } from './net/setAccountLogin';
import { setAccountNotifications } from './net/setAccountNotifications';
import { setAccountSearchable } from './net/setAccountSearchable';
import { setAccountSeal } from './net/setAccountSeal';
import { clearAccountSeal } from './net/clearAccountSeal';

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class AccountModule implements Account {

  private emitter: EventEmitter;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private log: Logging;
  private store: Store;
  private crypto: Crypto | null;
  private syncing: boolean;
  private closing: boolean;
  private revision: number;
  private nextRevision: number | null;
  private entity: AccountEntity;
  private sealKey: { privateKey: string, publicKey: string } | null;

  constructor(log: Logging, store: Store, crypto: Crypto | null, guid: string, token: string, node: string, secure: boolean) {
    this.log = log;
    this.store = store;
    this.crypto = crypto;
    this.emitter = new EventEmitter();
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.sealKey = null;
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
    this.sealKey = await this.store.getSeal(this.guid);
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
            await this.store.setAccountData(guid, status);
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
      this.syncing = false;
    }
  }

  public getStatus() {
    const { storageUsed, storageAvailable, forwardingAddress, searchable, allowUnsealed, pushEnabled, sealable, seal, enableIce, multiFactorAuth, webPushKey } = this.entity;
    const { passwordSalt, privateKeyIv, privateKeyEncrypted, publicKey } = seal || {};
    const sealSet = Boolean(passwordSalt && privateKeyIv && privateKeyEncrypted && publicKey);
    const sealUnlocked = Boolean(sealSet && this.sealKey?.privateKey && this.sealKey?.publicKey == publicKey)
    return { storageUsed, storageAvailable, forwardingAddress, searchable, allowUnsealed, pushEnabled, sealable, sealSet, sealUnlocked, enableIce, multiFactorAuth, webPushKey };
  }

  public addStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.on('status', ev);
    this.emitter.emit('status', this.getStatus());
  }

  public removeStatusListener(ev: (status: AccountStatus) => void): void {
    this.emitter.off('status', ev);
  }

  public async close(): Promise<void> {
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
    const { node, secure, token } = this;
    await setAccountNotifications(node, secure, token, true);
  }

  public async disableNotifications(): Promise<void> {
    const { node, secure, token } = this;
    await setAccountNotifications(node, secure, token, false);
  }

  public async enableRegistry(): Promise<void> {
    const { node, secure, token } = this;
    await setAccountSearchable(node, secure, token, true);
  }

  public async disableRegistry(): Promise<void> {
    const { node, secure, token } = this;
    await setAccountSearchable(node, secure, token, false);
  }

  public async enableMFA(): Promise<{ secretImage: string, secretText: string }> {
    const { node, secure, token } = this;
    const { image, text } = await addAccountMFAuth(node, secure, token);
    return { secretImage: image, secretText: text };
  }

  public async disableMFA(): Promise<void> {
    const { node, secure, token } = this;
    await removeAccountMFAuth(node, secure, token);
  }

  public async confirmMFA(code: string): Promise<void> {
    const { node, secure, token } = this;
    await setAccountMFAuth(node, secure, token, code);
  }

  public async setSeal(password: string): Promise<void> {
    const { crypto, guid, node, secure, token } = this;
    if (!crypto) {
      throw new Error('crypto not enabled');
    }
    const { saltHex } = crypto.pbkdfSalt();
    const { aesKeyHex } = crypto.pbkdfKey(saltHex, password);
    const { publicKeyB64, privateKeyB64 } = crypto.rsaKey();
    const { ivHex } = crypto.aesIv();
    const { encryptedDataB64 } = crypto.aesEncrypt(privateKeyB64, ivHex, aesKeyHex);

    const entity = { passwordSalt: saltHex, privateKeyIv: ivHex, privateKeyEncrypted: encryptedDataB64, publicKey: publicKeyB64 };
    await setAccountSeal(node, secure, token, entity);

    const seal = { publicKey: publicKeyB64, privateKey: privateKeyB64 };
    this.store.setSeal(guid, seal);
    this.sealKey = seal;
    
    this.emitter.emit('status', this.getStatus());
  }

  public async clearSeal(): Promise<void> {
    const { guid, node, secure, token } = this;
    await clearAccountSeal(node, secure, token);
    await this.store.clearSeal(guid);
    this.sealKey = null;
    this.emitter.emit('status', this.getStatus());
  }

  public async unlockSeal(password: string): Promise<void> {
    const { guid, entity, crypto } = this;
    const { passwordSalt, privateKeyIv, privateKeyEncrypted, publicKey } = entity.seal;
    if (!passwordSalt || !privateKeyIv || !privateKeyEncrypted || !publicKey) {
      throw new Error('account seal not set');
    }
    if (!crypto) {
      throw new Error('crypto not set');
    }
    const { aesKeyHex } = crypto.pbkdfKey(passwordSalt, password);
    const { data } = crypto.aesDecrypt(privateKeyEncrypted, privateKeyIv, aesKeyHex);

    const seal = { publicKey: publicKey, privateKey: data };
    this.store.setSeal(guid, seal);
    this.sealKey = seal;

    this.emitter.emit('status', this.getStatus());
  }

  public async forgetSeal(): Promise<void> {
    const { guid } = this;
    await this.store.clearSeal(guid);
    this.sealKey = null;
    this.emitter.emit('status', this.getStatus());
  }

  public async setLogin(username: string, password: string): Promise<void> {
    const { node, secure, token } = this;
    await setAccountLogin(node, secure, token, username, password);
  }
}

