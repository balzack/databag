import { EventEmitter } from 'events';
import { type Identity, type Profile } from './api';

export class IdentityModule implements Identity {

  private token: string;
  private url: string;
  private sync: (flag: boolean) => void;
  private emitter: EventEmitter;

  constructor(token: string, url: string, sync: (flag: boolean) => void) {
    this.token = token;
    this.url = url;
    this.sync = sync;
    this.emitter = new EventEmitter();
  }

  public addProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.on('profile', ev);
  }

  public removeProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.off('profile', ev);
  }

  public async setRevision(rev: number): Promise<void> {
  }

  public async resync(): Promise<void> {
  }

  public async setProfileData(name: string, location: string, description: string): Promise<void> {
  }

  public async setProfileImage(image: string): Promise<void> {
  }

  public async getHandleStatus(handle: string): Promise<void> {
  }
}

