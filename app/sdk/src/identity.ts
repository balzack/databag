import { EventEmitter } from 'eventemitter3';
import type { Identity, Logging } from './api';
import type { Profile } from './types';
import { Store } from './store';

export class IdentityModule implements Identity {

  private token: string;
  private url: string;
  private log: Logging;
  private emitter: EventEmitter;

  constructor(log: Logging, token: string, url: string, store: Store) {
    this.token = token;
    this.url = url;
    this.log = log;
    this.emitter = new EventEmitter();
  }

  public addProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.on('profile', ev);
  }

  public removeProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.off('profile', ev);
  }

  public close(): void {
  }

  public async setRevision(rev: number): Promise<void> {
    console.log('set identity revision:', rev);
  }

  public async setProfileData(name: string, location: string, description: string): Promise<void> {
  }

  public async setProfileImage(image: string): Promise<void> {
  }

  public async getHandleStatus(handle: string): Promise<void> {
  }

  public getProfileImageUrl(): string {
    return '';
  }
}

