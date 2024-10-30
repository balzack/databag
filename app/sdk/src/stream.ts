import { EventEmitter } from 'eventemitter3';
import type { Content, Focus } from './api';
import { Logging } from './logging';
import { FocusModule } from './focus';
import type { ChannelItem } from './items';
import type { Channel, Topic, Asset, Tag, Participant } from './types';
import { Store } from './store';
import { Crypto } from './crypto';
import { getChannels } from './net/getChannels';
import { getChannelDetail } from './net/getChannelDetail';
import { getChannelSummary } from './net/getChannelSummary';
import { defaultChannelItem } from './items';

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class StreamModule {
  private log: Logging;
  private store: Store;
  private crypto: Crypto | null;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private emitter: EventEmitter;
  private focus: FocusModule | null;
  private revision: number;
  private syncing: boolean;
  private closing: boolean;
  private nextRevision: number | null;
  private seal: { privateKey: string; publicKey: string } | null;
  private unsealAll: boolean;
  private markers: Map<string>;
  private channelTypes: string[];

  // view of channels
  private channelEntries: Map<string, { item: ChannelItem; channel: Channel }>;

  constructor(log: Logging, store: Store, crypto: Crypto | null, guid: string, token: string, node: string, secure: boolean, channelTypes: string[]) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.store = store;
    this.crypto = crypto;
    this.focus = null;
    this.seal = null;
    this.unsealAll = false;
    this.channelTypes = channelTypes;
    this.emitter = new EventEmitter();

    this.channelEntries = new Map<string, { item: ChannelItem; channel: Channel }>();
    this.markers = new Set<string>();

    this.revision = 0;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();
  }

  private async init() {
    const { guid } = this;
    this.revision = await this.store.getContentRevision(guid);

    const values = await this.store.getMarkers(guid);
    values.forEach((value) => {
      this.markers.add(value);
    });

    // load map of channels
    const channels = await this.store.getContentChannels(guid);
    channels.forEach(({ channelId, item }) => {
      const channel = this.setChannel(channelId, item);
      this.channelEntries.set(channelId, { item, channel });
    });
    this.emitChannels();

    this.unsealAll = true;
    this.syncing = false;
    await this.sync();
  }

  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      const { guid, node, secure, token, channelTypes } = this;
      while (this.nextRevision && !this.closing) {
        if (this.nextRevision && this.revision !== this.nextRevision) {
          const nextRev = this.nextRevision;
          try {
            const delta = await getChannels(node, secure, token, this.revision, channelTypes);
            for (const entity of delta) {
              const { id, revision, data } = entity;
              if (data) {
                const { detailRevision, topicRevision, channelSummary, channelDetail } = data;
                const entry = await this.getChannelEntry(id);

                if (detailRevision !== entry.item.detail.revision) {
                  const detail = channelDetail ? channelDetail : await getChannelDetail(node, secure, token, id);
                  entry.item.detail = {
                    revision: detailRevision,
                    sealed: detail.dataType === 'sealed',
                    dataType: detail.dataType,
                    data: detail.data,
                    created: detail.created,
                    updated: detail.updated,
                    enableImage: detail.enableImage,
                    enableAudio: detail.enableAudio,
                    enableVideo: detail.enableVideo,
                    enableBinary: detail.enableBinary,
                    contacts: detail.contacts,
                    members: detail.members,
                  };
                  entry.item.unsealedDetail = null;
                  await this.unsealChannelDetail(id, entry.item);
                  entry.channel = this.setChannel(id, entry.item);
                  await this.store.setContentChannelDetail(guid, id, entry.item.detail, entry.item.unsealedDetail);
                }

                if (topicRevision !== entry.item.summary.revision) {
                  const summary = channelSummary ? channelSummary : await getChannelSummary(node, secure, token, id);
                  entry.item.summary = {
                    revision: topicRevision,
                    guid: summary.lastTopic.guid,
                    dataType: summary.lastTopic.dataType,
                    data: summary.lastTopic.data,
                    created: summary.lastTopic.created,
                    updated: summary.lastTopic.updated,
                    status: summary.lastTopic.status,
                    transform: summary.lastTopic.transform,
                  };
                  entry.item.unsealedSummary = null;
                  await this.unsealChannelSummary(id, entry.item);
                  this.setChannelUnread(id);
                  entry.channel = this.setChannel(id, entry.item);
                  await this.store.setContentChannelSummary(guid, id, entry.item.summary, entry.item.unsealedSummary);
                }

                if (this.focus) {
                  await this.focus.setRevision(null, id, topicRevision);
                }
              } else {
                this.channelEntries.delete(id);
                await this.store.removeContentChannel(guid, id);
                if (this.focus) {
                  await this.focus.disconnect(id);
                }
              }
            }

            this.emitChannels();
            await this.store.setContentRevision(guid, nextRev);
            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`content revision: ${nextRev}`);
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          }
        }

        if (this.revision === this.nextRevision) {
          this.nextRevision = null;
        }
      }

      if (this.unsealAll) {
        for (const [channelId, entry] of this.channelEntries.entries()) {
          try {
            const { item } = entry;
            if (await this.unsealChannelDetail(channelId, item)) {
              await this.store.setContentChannelUnsealedDetail(guid, channelId, item.unsealedDetail);
            }
            if (await this.unsealChannelSummary(channelId, item)) {
              await this.store.setContentChannelUnsealedSummary(guid, channelId, item.unsealedSummary);
            }
            entry.channel = this.setChannel(channelId, item);
          } catch (err) {
            this.log.warn(err);
          }
        }
        this.unsealAll = false;
      }

      this.syncing = false;
    }
  }

  public addChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.emitter.on('channel', ev);
    const channels = Array.from(this.channelEntries, ([channelId, entry]) => entry.channel);
console.log("EMIT ON ADD", channels.length);
    ev({ channels, cardId: null });
  }

  public removeChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.emitter.off('channel', ev);
  }

  private emitChannels() {
    const channels = Array.from(this.channelEntries, ([channelId, entry]) => entry.channel);
console.log("EMIT", channels.length);
    this.emitter.emit('channel', { channels, cardId: null });
  } 

  public async close(): Promise<void> {
    this.closing = true;
    while (this.syncing) { 
      await new Promise((r) => setTimeout(r, CLOSE_POLL_MS));
    }
  }

  public async setRevision(rev: number): Promise<void> {
    this.nextRevision = rev;
    await this.sync();
  }

  public async addChannel(sealed: boolean, type: string, subject: string, cardIds: string[]): Promise<string> {
    return '';
  }

  public async removeChannel(channelId: string): Promise<void> { }

  public async setChannelSubject(channelId: string, subject: string): Promise<void> { }

  public async setChannelCard(channelId: string, cardId: string): Promise<void> { }

  public async clearChannelCard(channelId: string, cardId: string): Promise<void> { }

  public async setBlockedChannel(channelId: string, blocked: boolean): Promise<void> { }

  public async getBlockedChannels(): Promise<Channel[]> {
    return [];
  }

  public async flagChannel(channelId: string): Promise<void> { }

  public async getChannelNotifications(channelId: string): Promise<boolean> {
    return false;
  }

  public async setChannelNotifications(channelId: string, enabled: boolean): Promise<void> { }

  public async setUnreadChannel(channelId: string, unread: boolean): Promise<void> { }

  public async setFocus(channelId: string): Promise<Focus> {
    const { node, secure, token, focus } = this;
    if (focus) {
      await focus.close();
    }
    this.focus = new FocusModule(this.log, this.store, this.crypto, null, channelId, this.guid, { node, secure, token });
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

  private async getChannelKey(seals: [{ publicKey: string; sealedKey: string }]): Promise<string | null> {
    const seal = seals.find(({ publicKey }) => this.seal && publicKey === this.seal.publicKey);
    if (seal && this.crypto && this.seal) {
      const key = await this.crypto.rsaDecrypt(seal.sealedKey, this.seal.privateKey);
      return key.data;
    }
    return null;
  }

  private isMarked(marker: string, channelId: string | null, topicId: string | null, tagId: string | null): boolean {
    const channel = channelId ? `"${channelId}"` : 'null';
    const topic = topicId ? `"{topicId}"` : 'null';
    const tag = tagId ? `"${tagId}"` : 'null';
    const value = `{ "marker": "${marker}", "cardId": null, "channelId": ${channel}, "topicId": ${topic}, "tagId": ${tag} }`;
    return this.markers.has(value);
  }

  private async setMarker(marker: string, channelId: string | null, topicId: string | null, tagId: string | null) {
    const channel = channelId ? `"${channelId}"` : 'null';
    const topic = topicId ? `"{topicId}"` : 'null';
    const tag = tagId ? `"${tagId}"` : 'null';
    const value = `{ "marker": "${marker}", "cardId": null, "channelId": ${channel}, "topicId": ${topic}, "tagId": ${tag} }`;
    this.markers.add(value);
    await this.store.setMarker(this.guid, value);
  }   
      
  private async clearMarker(marker: string, channelId: string | null, topicId: string | null, tagId: string | null) {
    const channel = channelId ? `"${channelId}"` : 'null';
    const topic = topicId ? `"{topicId}"` : 'null';
    const tag = tagId ? `"${tagId}"` : 'null';
    const value = `{ "marker": "${marker}", "cardId": null, "channelId": ${channel}, "topicId": ${topic}, "tagId": ${tag} }`;
    this.markers.delete(value);
    await this.store.clearMarker(this.guid, value);
  } 
  
  private isChannelBlocked(channelId: string): boolean {
    return this.isMarked('blocked_channel', channelId, null, null);
  }     
          
  private async setChannelBlocked(channelId: string) {
    await this.setMarker('blocked_channel', channelId, null, null);
  }       
          
  private async clearChannelBlocked(channelId: string) {
    await this.clearMarker('blocked_channel', channelId, null, null);
  }     

  private isChannelUnread(channelId: string): boolean {
    return this.isMarked('unread', channelId, null, null);
  }

  private async setChannelUnread(channelId: string) {
    await this.setMarker('unread', channelId, null, null);
  }

  private async clearChannelUnread(channelId: string) {
    await this.clearMarker('unread', channelId, null, null);
  }

  private setChannel(channelId: string, item: ChannelItem): Channel {
    const { summary, detail } = item;
    const channelData = detail.sealed ? item.unsealedDetail : detail.data;
    const topicData = summary.sealed ? item.unsealedSummary : summary.data;
  
    return {
      channelId, 
      cardId: null,
      lastTopic: {
        guid: summary.guid,
        sealed: summary.sealed,
        dataType: summary.dataType,
        data: topicData,
        created: summary.created,
        updated: summary.updated,
        status: summary.status,
        transform: summary.transform,
      },
      blocked: this.isChannelBlocked(channelId),
      unread: this.isChannelUnread(channelId),
      sealed: detail.sealed,
      dataType: detail.dataType,
      data: channelData, 
      created: detail.created,
      updated: detail.updated,
      enableImage: detail.enableImage,
      enableAudio: detail.enableAudio,
      enableVideo: detail.enableVideo,
      enableBinary: detail.enableBinary,
      members: detail.members.map((guid) => ({ guid })),
    };
  }

  private async getChannelEntry(channelId: string) {
    const { guid } = this;
    const entry = this.channelEntries.get(channelId);
    if (entry) {
      return entry;
    }
    const item = JSON.parse(JSON.stringify(defaultChannelItem));
    const channel = this.setChannel(channelId, item);
    const channelEntry = { item, channel };
    this.channelEntries.set(channelId, channelEntry);
    await this.store.addContentChannel(guid, channelId, item);
    return channelEntry;
  }

  private async unsealChannelDetail(channelId: string, item: ChannelItem): Promise<boolean> {
    if (item.unsealedDetail == null && item.detail.dataType === 'sealed' && this.seal && this.crypto) {
      try {
        const { subjectEncrypted, subjectIv, seals } = JSON.parse(item.detail.data);
        if (!item.channelKey) {
          item.channelKey = await this.getChannelKey(seals);
        }
        if (item.channelKey) {
          const { data } = await this.crypto.aesDecrypt(subjectEncrypted, subjectIv, item.channelKey);
          const { subject } = JSON.parse(data);
          item.unsealedDetail = subject;
          return true;
        }
      } catch (err) {
        this.log.warn(err);
      }
    }
    return false;
  }

  private async unsealChannelSummary(channelId: string, item: ChannelItem): Promise<boolean> {
    if (item.unsealedSummary == null && item.summary.dataType === 'sealedtopic' && this.seal && this.crypto) {
      try {
        if (!item.channelKey) {
          const { seals } = JSON.parse(item.detail.data);
          item.channelKey = await this.getChannelKey(seals);
        }
        if (item.channelKey) {
          const { messageEncrypted, messageIv } = JSON.parse(item.summary.data);
          const { data } = await this.crypto.aesDecrypt(messageEncrypted, messageIv, item.channelKey);
          const { message } = JSON.parse(data);
          item.unsealedSummary = message;
          return true;
        }
      } catch (err) {
        this.log.warn(err);
      }
    }
    return false;
  }

}
