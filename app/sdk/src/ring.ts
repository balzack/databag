import { EventEmitter } from 'events';
import type { Ring } from './api';
import type { Call } from './types';

export class RingModule implements Ring {

  private emitter: EventEmitter;

  constructor() {
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

  public accept(callId: string): void {
  }

  public ignore(callId: string): void {
  }

  public decline(callId: string): void {
  }

  public close(): void {
  }
}
