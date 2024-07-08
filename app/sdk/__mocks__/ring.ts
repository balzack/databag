import { EventEmitter } from 'eventemitter3';
import type { Ring } from '../src/api';
import type { Call } from '../src/types';

export class MockRingModule implements Ring {

  public call: Call | null;
  private emitter: EventEmitter;

  constructor() {
    this.call = null;
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

  public ring(call: Call): void {
    this.call = call;
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
