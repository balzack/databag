import { EventEmitter } from "eventemitter3";
import type { Settings } from "./api";
import type { Config } from "./types";
import { Store } from "./store";
import { Crypto } from "./crypto";
import { Logging } from "./logging";
import { defaultConfigEntity, ConfigEntity } from "./entities";
import { getAccountStatus } from "./net/getAccountStatus";
import { addAccountMFAuth } from "./net/addAccountMFAuth";
import { setAccountMFAuth } from "./net/setAccountMFAuth";
import { removeAccountMFAuth } from "./net/removeAccountMFAuth";
import { setAccountLogin } from "./net/setAccountLogin";
import { setAccountNotifications } from "./net/setAccountNotifications";
import { setAccountSearchable } from "./net/setAccountSearchable";
import { setAccountSeal } from "./net/setAccountSeal";
import { clearAccountSeal } from "./net/clearAccountSeal";
import { getUsername } from "./net/getUsername";

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class SettingsModule implements Settings {
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
  private config: ConfigEntity;
  private seal: { privateKey: string; publicKey: string } | null;

  constructor(
    log: Logging,
    store: Store,
    crypto: Crypto | null,
    guid: string,
    token: string,
    node: string,
    secure: boolean,
  ) {
    this.log = log;
    this.store = store;
    this.crypto = crypto;
    this.emitter = new EventEmitter();
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.seal = null;
    this.secure = secure;
    this.revision = 0;
    this.config = defaultConfigEntity;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();
  }

  private getSeal() {
    if (this.seal?.publicKey && this.config.seal?.publicKey) {
      return this.seal;
    }
    return null;
  }

  private async init() {
    this.revision = await this.store.getSettingsRevision(this.guid);
    this.config = await this.store.getSettingsData(this.guid);
    this.seal = await this.store.getSeal(this.guid);
    this.emitter.emit("seal", this.getSeal());
    this.emitter.emit("config", this.getConfig());
    this.syncing = false;
    await this.sync();
  }

  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      while (this.nextRevision && !this.closing) {
        if (this.revision == this.nextRevision) {
          this.nextRevision = null;
        } else {
          const nextRev = this.nextRevision;
          try {
            const { guid, node, secure, token } = this;
            const config = await getAccountStatus(node, secure, token);
            await this.store.setSettingsData(guid, config);
            await this.store.setSettingsRevision(guid, nextRev);
            this.config = config;
            this.emitter.emit("config", this.getConfig());
            this.emitter.emit("seal", this.getSeal());
            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`account revision: ${nextRev}`);
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          }
        }
      }
      this.syncing = false;
    }
  }

  public getConfig() {
    const {
      storageUsed,
      storageAvailable,
      forwardingAddress,
      searchable,
      allowUnsealed,
      pushEnabled,
      sealable,
      seal,
      enableIce,
      mfaEnabled,
      webPushKey,
    } = this.config;
    const { passwordSalt, privateKeyIv, privateKeyEncrypted, publicKey } =
      seal || {};
    const sealSet = Boolean(
      passwordSalt && privateKeyIv && privateKeyEncrypted && publicKey,
    );
    const sealUnlocked = Boolean(
      sealSet && this.seal?.privateKey && this.seal?.publicKey == publicKey,
    );
    return {
      storageUsed,
      storageAvailable,
      forwardingAddress,
      searchable,
      allowUnsealed,
      pushEnabled,
      sealable,
      sealSet,
      sealUnlocked,
      enableIce,
      mfaEnabled,
      webPushKey,
    };
  }

  public addConfigListener(ev: (config: Config) => void): void {
    this.emitter.on("config", ev);
    this.emitter.emit("config", this.getConfig());
  }

  public removeConfigListener(ev: (config: Config) => void): void {
    this.emitter.off("config", ev);
  }

  public addSealListener(
    ev: (seal: { privateKey: string; publicKey: string } | null) => void,
  ): void {
    this.emitter.on("seal", ev);
    ev(this.seal);
  }

  public removeSealListener(
    ev: (seal: { privateKey: string; publicKey: string } | null) => void,
  ): void {
    this.emitter.off("seal", ev);
  }

  public async close(): Promise<void> {
    this.closing = true;
    while (this.syncing) {
      await new Promise((r) => setTimeout(r, CLOSE_POLL_MS));
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

  public async enableMFA(): Promise<{
    secretImage: string;
    secretText: string;
  }> {
    const { node, secure, token } = this;
    const { secretImage, secretText } = await addAccountMFAuth(
      node,
      secure,
      token,
    );
    return { secretImage, secretText };
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
      throw new Error("crypto not enabled");
    }
    const { saltHex } = await crypto.pbkdfSalt();
    const { aesKeyHex } = await crypto.pbkdfKey(saltHex, password);
    const { publicKeyB64, privateKeyB64 } = await crypto.rsaKey();
    const { ivHex } = await crypto.aesIv();
    const { encryptedDataB64 } = await crypto.aesEncrypt(
      privateKeyB64,
      ivHex,
      aesKeyHex,
    );
    const seal = {
      passwordSalt: saltHex,
      privateKeyIv: ivHex,
      privateKeyEncrypted: encryptedDataB64,
      publicKey: publicKeyB64,
    };
    await setAccountSeal(node, secure, token, seal);
    this.seal = { publicKey: publicKeyB64, privateKey: privateKeyB64 };
    this.store.setSeal(guid, this.seal);
    this.emitter.emit("config", this.getConfig());
    this.emitter.emit("seal", this.getSeal());
  }

  public async updateSeal(password: string): Promise<void> {
    const { crypto, config, node, secure, token } = this;
    if (!crypto) {
      throw new Error("crypto not enabled");
    }
    if (!this.seal || this.seal.publicKey !== config.seal.publicKey) {
      throw new Error("seal not unlocked");
    }
    const { saltHex } = await crypto.pbkdfSalt();
    const { aesKeyHex } = await crypto.pbkdfKey(saltHex, password);
    const { ivHex } = await crypto.aesIv();
    const { encryptedDataB64 } = await crypto.aesEncrypt(
      this.seal.privateKey,
      ivHex,
      aesKeyHex,
    );
    const seal = {
      passwordSalt: saltHex,
      privateKeyIv: ivHex,
      privateKeyEncrypted: encryptedDataB64,
      publicKey: config.seal.publicKey,
    };
    await setAccountSeal(node, secure, token, seal);
  }

  public async clearSeal(): Promise<void> {
    const { guid, node, secure, token } = this;
    await clearAccountSeal(node, secure, token);
    await this.store.clearSeal(guid);
    this.seal = null;
    this.emitter.emit("config", this.getConfig());
    this.emitter.emit("seal", this.getSeal());
  }

  public async unlockSeal(password: string): Promise<void> {
    const { guid, config, crypto } = this;
    const { passwordSalt, privateKeyIv, privateKeyEncrypted, publicKey } =
      config.seal;
    if (!passwordSalt || !privateKeyIv || !privateKeyEncrypted || !publicKey) {
      throw new Error("account seal not set");
    }
    if (!crypto) {
      throw new Error("crypto not set");
    }
    const { aesKeyHex } = await crypto.pbkdfKey(passwordSalt, password);
    const { data } = await crypto.aesDecrypt(
      privateKeyEncrypted,
      privateKeyIv,
      aesKeyHex,
    );
    const seal = { publicKey: publicKey, privateKey: data };
    this.store.setSeal(guid, seal);
    this.seal = seal;
    this.emitter.emit("config", this.getConfig());
    this.emitter.emit("seal", this.getSeal());
  }

  public async forgetSeal(): Promise<void> {
    const { guid } = this;
    await this.store.clearSeal(guid);
    this.seal = null;
    this.emitter.emit("config", this.getConfig());
    this.emitter.emit("seal", this.getSeal());
  }

  public async getUsernameStatus(username: string): Promise<boolean> {
    const { node, secure, token } = this;
    return await getUsername(username, null, token, node, secure);
  }

  public async setLogin(username: string, password: string): Promise<void> {
    const { node, secure, token } = this;
    await setAccountLogin(node, secure, token, username, password);
  }
}
