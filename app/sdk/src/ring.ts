import { EventEmitter } from 'eventemitter3';
import type { Ring, Logging } from './api';
import type { Call } from './types';

export class RingModule implements Ring {
  private log: Logging;
  private emitter: EventEmitter;

  constructor(log: Logging) {
    this.log = log;
    this.emitter = new EventEmitter();
  }

  public addCallingListener(ev: (calls: Call[]) => void): void {
    this.emitter.on('calling', ev);
  }

  public removeCallingListener(ev: (calls: Call[]) => void): void {
    this.emitter.off('calling', ev);
  }

  public addCallListener(ev: (call: Call | null) => void): void {
    this.emitter.on('call', ev);
  }

  public removeCallListener(ev: (call: Call | null) => void): void {
    this.emitter.off('call', ev);
  }

  public ring(call: Call): void {}

  public accept(callId: string): void {}

  public ignore(callId: string): void {}

  public decline(callId: string): void {}

  public close(): void {}
}
