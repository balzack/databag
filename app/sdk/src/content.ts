import { EventEmitter } from 'eventemitter3';
import type { Content, Logging, Focus } from './api';
import { FocusModule } from './focus';
import type { ChannelItem } from './items';
import type { Channel, Topic, Asset, Tag, Participant } from './types';
import { Store } from './store';
import { Crypto } from './crypto';

export class ContentModule implements Content {
  private log: Logging;
  private store: Store;
  private crypto: Crypto | null;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private emitter: EventEmitter;
  private focus: Focus | null;
  private revision: number;
  private syncing: boolean;
  private closing: boolean;
  private nextRevision: number | null;

  // view of channels
  private channelEntries: Map<string, { item: ChannelItem; channel: Channel }>;

  constructor(log: Logging, store: Store, crypto: Crypto | null, guid: string, token: string, node: string, secure: boolean) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.store = store;
    this.crypto = crypto;
    this.focus = null;
    this.emitter = new EventEmitter();

    this.channelEntries = new Map<string, { item: ChannelItem; channel: Channel }>();

    this.revision = 0;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();
  }

  private async init() { }

  private async sync() { }

  public addChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.emitter.on('channel', ev);
    const channels = Array.from(this.channelEntries, ([channelId, entry]) => entry.channel);
    ev({ channels, cardId: null });
  }

  public removeChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.emitter.off('channel', ev);
  }

  private emitChannels() {
    const channels = Array.from(this.channelEntries, ([channelId, entry]) => entry.channel);
    this.emitter.emit('channel', { channels, cardId: null });
  } 

  public async close(): void {}

  public async setRevision(rev: number): Promise<void> {
    console.log('set content revision:', rev);
  }

  public async addChannel(sealed: boolean, type: string, subject: string, cardIds: string[]): Promise<string> {
    return '';
  }

  public async removeChannel(channelId: string): Promise<void> { }

  setChannelSubject(channelId: string, subject: string): Promise<void> { }

  setChannelCard(channelId: string, cardId: string): Promise<void> { }

  clearChannelCard(channelId: string, cardId: string): Promise<void> { }

  setBlockedChannel(channelId: string, blocked: boolean): Promise<void> { }

  getBlockedChannels(): Promise<Channel[]> {
    return [];
  }

  flagChannel(channelId: string): Promise<void> { }

  getChannelNotifications(channelId: string): Promise<boolean> { }

  setChannelNotifications(channelId: string, enabled: boolean): Promise<void> { }

  setUnreadChannel(channelId: string, unread: boolean): Promise<void> { }

  public async setFocus(chanenlId: string): Promise<Focus> {
    const { node, secure, token } = this;
    this.focus = new FocusModule(this.log, this.store, this.crypto, null, channelId, { node, secure, token });
    return this.focus;
  }

  public async clearFocus() {
    if (this.focus) {
      await this.focus.close();
    }
    this.focus = null;
  }

  public async setSeal(seal: { privateKey: string; publicKey: string } | null) {
    this.seal = seal;
    this.unsealAll = true;
    await this.sync();
  }
}
