import { EventEmitter } from 'events';
import type { Contact, Content, Stream } from './api';
import type { Channel } from './types';

export class StreamModule implements Stream {

  private contact: Contact;
  private content: Content;
  private emitter: EventEmitter;

  constructor(contact: Contact, content: Content) {
    this.contact = contact;
    this.content = content;
    this.emitter = new EventEmitter();
  }

  public addChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.on('channel', ev);
  }

  public removeChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.off('channel', ev);
  }

}
