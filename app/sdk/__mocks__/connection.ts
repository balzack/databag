import { EventEmitter } from 'eventemitter3';
import { Revision, Ringing } from '../src/entities';

export class MockConnection {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public close() {
  }

  public addRevisionListener(ev: (revision: Revision) => void): void {
    this.emitter.on('revision', ev);
  }

  public removeRevisionListener(ev: (revision: Revision) => void): void {
    this.emitter.off('revision', ev);
  }

  public addRingListener(ev: (ringing: Ringing) => void): void {
    this.emitter.on('ringing', ev);
  }

  public removeRingListener(ev: (ringing: Ringing) => void): void {
    this.emitter.off('ringing', ev);
  }

  public addStatusListener(ev: (status: string) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.emitter.off('status', ev);
  }

  public emitRevision(revision: Revision): void {
    this.emitter.emit('revision', revision);
  }

  public emitRing(ring: Ringing): void {
    this.emitter.emit('ringing', ring);
  }

  public emitStatus(status: string): void {
    this.emitter.emit('status', status);
  }
}

