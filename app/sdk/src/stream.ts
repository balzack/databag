import { EventEmitter } from 'eventemitter3';
import type { Contact, Content, Stream, Logging } from './api';
import type { Channel } from './types';
import { Store } from './store';

export class StreamModule implements Stream {

  private log: Logging;
  private contact: Contact;
  private content: Content;
  private emitter: EventEmitter;

  constructor(log: Logging, contact: Contact, content: Content, store: Store) {
    this.contact = contact;
    this.content = content;
    this.log = log;
    this.emitter = new EventEmitter();
  }

  public addChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.on('channel', ev);
  }

  public removeChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.off('channel', ev);
  }

  public close(): void {
  }
}
