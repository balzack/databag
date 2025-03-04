import { EventEmitter } from 'eventemitter3';
import type { Ring, Link } from '../src/api';
import type { Call } from '../src/types';
import { MockLinkModule } from './link';
export class MockRingModule implements Ring {

  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public addRingingListener(ev: (calls: { cardId: string, callId: string }[]) => void): void {
  }

  public removeRingingListener(ev: (calls: { cardId: string, callId: string }[]) => void): void {
  }

  public ring(call: Call): void {
  }

  public async accept(cardId: string, callId: string, contactNode: string): Promise<Link> {
    return new MockLinkModule();
  }

  public async decline(cardId: string, callId: string, contactNode: string): Promise<void> {
  }

  public async ignore(cardId: string, callId: string): Promise<void> {
  }
}
