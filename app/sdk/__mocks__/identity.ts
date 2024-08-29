import { EventEmitter } from 'eventemitter3';
import { type Identity } from '../src/api';
import { type Profile } from '../src/types';

export class MockIdentityModule implements Identity {

  public revision: number;
  private emitter: EventEmitter;

  constructor() {
    this.revision = 0;
    this.emitter = new EventEmitter();
  }

  public addProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.on('profile', ev);
  }

  public removeProfileListener(ev: (profile: Profile) => void): void {
    this.emitter.off('profile', ev);
  }

  public async close(): Promise<void> {
  }

  public async setRevision(rev: number): Promise<void> {
    this.revision = rev;
  }

  public async setProfileData(name: string, location: string, description: string): Promise<void> {
  }

  public async setProfileImage(image: string): Promise<void> {
  }

  public getProfileImageUrl(): string {
    return '';
  }
}

