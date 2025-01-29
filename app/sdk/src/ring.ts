import { EventEmitter } from 'eventemitter3';
import { LinkModule } from './link';
import type { Ring, Link, Logging } from './api';
import type { Call } from './types';
import { removeContactCall } from './net/removeContactCall';

const EXPIRES = 6000;

export class RingModule implements Ring {
  private log: Logging;
  private emitter: EventEmitter;
  private token: string;
  private node: string;
  private secure: boolean;
  private calls: Map<string, { call: Call, expires: number, status: string }>
  private closed: boolean;

  constructor(log: Logging) {
    this.log = log;
    this.emitter = new EventEmitter();
    this.calls = new Map<string, { call: Call, expires: number }>();
    this.expire = null;
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
    await link.join(contactNode, entry.call.calleeToken, entry.call.ice);
    return link;
  }

  public async ignore(cardId: stirng, callId: string): Promise<void> {
    const id = `${cardId}:${callId}`;
    const entry = this.calls.get(id);
    if (!entry || entry.expires < now || entry.status !== 'ringing') {
      throw new Error('invalid ringing entry');
    }
    entry.status = 'ignored';
    this.emitRinging();
  }

  public async decline(cardId: string, callId: string, contactNode: string): Promise<void> {
    const id = `${cardId}:${callId}`;
    const entry = this.calls.get(id);
    if (!entry || entry.expires < now || entry.status !== 'ringing') {
      throw new Error('invalid ringing entry');
    }
    entry.status = 'declined';
    this.emitRinging();
    try {
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(contactNode);
      await removeContactCall(contactNode, !insecure, entry.call.calleeToken, entry.call.callId);
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
