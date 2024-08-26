import { EventEmitter } from 'eventemitter3';
import type { Contact, Content, Stream } from './api';
import type { Channel } from './types';
import { Store } from './store';
import { Logging } from './logging';

export class StreamModule implements Stream {

  private log: Logging;
  private guid: string;
  private contact: Contact;
  private content: Content;
  private emitter: EventEmitter;

  constructor(log: Logging, contact: Contact, content: Content, store: Store, guid: string) {
    this.contact = contact;
    this.content = content;
    this.log = log;
    this.guid = guid;
    this.emitter = new EventEmitter();
  }

  public addChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.on('channel', ev);
  }

  public removeChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.off('channel', ev);
  }

  public async close(): Promise<void> {
  }
}
