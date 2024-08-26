import { EventEmitter } from 'eventemitter3';
import type { Identity } from './api';
import type { Logging } from './logging';
import type { Profile } from './types';
import { Store } from './store';
import { getProfile } from './net/getProfile';
import { getProfileImageUrl } from './net/getProfileImageUrl';
import { setProfileData } from './net/setProfileData';
import { setProfileImage } from './net/setProfileImage';
import { getUsername } from './net/getUsername';
import { ProfileEntity, defaultProfileEntity } from './entities';

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class IdentityModule implements Identity {

  private guid: string;
  private token: string;
  private node: string;
  private revision: number;
  private nextRevision: number | null;
  private profile: ProfileEntity;
  private secure: boolean;
  private store: Store;
  private log: Logging;
  private syncing: boolean;
  private closing: boolean;
  private emitter: EventEmitter;

  constructor(log: Logging, store: Store, guid: string, token: string, node: string, secure: boolean) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.store = store;
    this.log = log;
    this.emitter = new EventEmitter();
    this.revision = 0;
    this.profile = defaultProfileEntity;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();
  }

  private async init() {
    this.revision = await this.store.getProfileRevision(this.guid);
    this.profile = await this.store.getProfileData(this.guid);
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
            const profile = await getProfile(node, secure, token);
            await this.store.setProfileData(guid, profile);
            await this.store.setProfileRevision(guid, nextRev);
            this.profile = profile;
            this.emitter.emit('profile', this.getProfile());
            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`identity revision: ${nextRev}`);
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

  public getProfile() {
    const { guid, handle, name, description, location, image, revision, seal, version, node } = this.profile;
    return { guid, handle, name, description, location, image, version, node, sealSet: Boolean(seal) };
  }

  public addProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.on('profile', ev);
    this.emitter.emit('profile', this.getProfile());
  }

  public removeProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.off('profile', ev);
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

  public async setProfileData(name: string, location: string, description: string): Promise<void> {
    const { node, secure, token } = this;
    await setProfileData(node, secure, token, name, location, description);
  }

  public async setProfileImage(image: string): Promise<void> {
    const { node, secure, token } = this;
    await setProfileImage(node, secure, token, image);
  }

  public async getHandleStatus(handle: string): Promise<boolean> {
    const { node, secure, token } = this;
    return await getUsername(handle, token, node, secure);
  }

  public getProfileImageUrl(): string {
    const { node, secure, token, revision } = this;
    return getProfileImageUrl(node, secure, token, revision);
  }
}

