import { EventEmitter } from 'eventemitter3';
import { LinkModule } from './link';
import type { Ring, Link } from './api';
import { Logging } from './logging';
import type { Call } from './types';
import { removeContactCall } from './net/removeContactCall';

const EXPIRES = 6000;

export class RingModule implements Ring {
  private log: Logging;
  private accountNode: string;
  private emitter: EventEmitter;
  private calls: Map<string, { call: Call, expires: number, status: string }>
  private closed: boolean;
  private endContactCall: (cardId: string, callId: string) => Promise<void>;

  constructor(log: Logging, node: string, endContactCall: (cardId: string, callId: string) => Promise<void>) {
    this.log = log;
    this.accountNode = node;
    this.endContactCall = endContactCall;
    this.emitter = new EventEmitter();
    this.calls = new Map<string, { call: Call, expires: number, status: string }>();
    this.closed = false;
  }

  public addRingingListener(ev: (calls: { cardId: string, callId: string }[]) => void): void {
    this.emitter.on('ringing', ev);
  }

  public removeRingingListener(ev: (calls: { cardId: string, callId: string }[]) => void): void {
    this.emitter.off('ringing', ev);
  }

  public ring(call: Call): void {
    const now = (new Date()).getTime();
    const { cardId, callId } = call;
    const expires = now + EXPIRES;
    const id = `${cardId}:${callId}`;
    const ringing = this.calls.get(id);
    if (ringing) {
      ringing.expires = expires;
    } else {
      this.calls.set(id, { expires, call, status: 'ringing' });
    }
    this.emitRinging();
    setTimeout(() => { this.emitRinging() }, EXPIRES + 1);
  }

  private emitRinging(): void {
    if (!this.closed) {
      const now = (new Date()).getTime();
      const ringing = Array.from(this.calls.values());
      this.emitter.emit('ringing', ringing.filter(item => item.expires > now && item.status === 'ringing').map(item => ({ cardId: item.call.cardId, callId: item.call.callId })));
    }
  }

  public async accept(cardId: string, callId: string, contactNode: string): Promise<Link> {
    const now = (new Date()).getTime();
    const id = `${cardId}:${callId}`;
    const entry = this.calls.get(id);
    if (!entry || entry.expires < now || entry.status !== 'ringing') {
      throw new Error('invalid ringing entry');
    }
    entry.status = 'accepted';
    this.emitRinging();
    const link = new LinkModule(this.log);
    const node = contactNode ? contactNode : accountNode;
console.log("NODE: ", node, contactNode, accountNode);
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(node);
    await link.join(contactNode, !insecure, entry.call.calleeToken, entry.call.ice, async ()=>{ await this.endContactCall(cardId, callId) });
    return link;
  }

  public async ignore(cardId: string, callId: string): Promise<void> {
    const now = (new Date()).getTime();
    const id = `${cardId}:${callId}`;
    const entry = this.calls.get(id);
    if (!entry || entry.expires < now || entry.status !== 'ringing') {
      throw new Error('invalid ringing entry');
    }
    entry.status = 'ignored';
    this.emitRinging();
  }

  public async decline(cardId: string, callId: string): Promise<void> {
    const now = (new Date()).getTime();
    const id = `${cardId}:${callId}`;
    const entry = this.calls.get(id);
    if (!entry || entry.expires < now || entry.status !== 'ringing') {
      throw new Error('invalid ringing entry');
    }
    entry.status = 'declined';
    this.emitRinging();
    try {
      await this.endContactCall(cardId, callId);
    }
    catch (err) {
      console.log(err);
    }
  }

  public close(): void {
    this.closed = true;
    this.emitter.emit('ringing', []);
  }
}
