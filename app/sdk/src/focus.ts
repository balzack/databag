import { EventEmitter } from 'eventemitter3';
import type { Focus } from './api';
import { TopicItem } from './item';
import type { Topic, Asset, AssetSource, Participant } from './types';
import type { Logging } from './logging';
import { Store } from './store';
import { Crypto } from './crypto';
import { getChannelTopics } from './net/getChannelTopics';
import { getChannelTopicDetail } from './net/getChannelTopicDetail';
import { getContactChannelTopics } from './net/getContactChannelTopics'
import { getContactChannelTopicDetail } from './net/getContactChannelTopicDetail';

const BATCH_COUNT = 64;
const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class FocusModule implements Focus {
  private cardId: string | null;
  private channelId: string;
  private log: Logging;
  private emitter: EventEmitter;
  private crypto: Crypto | null;
  private store: Store;
  private guid: string;
  private connection: { node: string; secure: boolean; token: string } | null;
  private syncing: boolean;
  private closing: boolean;
  private nextRevision: number;
  private revision: {revision: number, marker: number} | null;
  private lastTopic: {topicId: string, position: number} | null;
  private moreLocal: boolean;
  private moreRemote: boolean;
  private sealEnabled: boolean;
  private channelKey: string | null;
  private loadMore: boolean;

  private markers: Set<string>;

  // view of topics 
  private topicEntries: Map<string, { item: TopicItem; topic: Topic }>;

  constructor(log: Logging, store: Store, crypto: Crypto | null, cardId: string | null, channelId: string, guid: string, connection: { node: string; secure: boolean; token: string } | null, channelKey: string, sealEnabled: boolean, revision: number) {
    this.cardId = cardId;
    this.channelId = channelId;
    this.log = log;
    this.emitter = new EventEmitter();
    this.store = store;
    this.crypto = crypto;
    this.guid = guid;
    this.connection = connection;
    this.channelKey = channelKey;
    this.sealEnabled = sealEnabled;

    this.topicEntries = new Map<string, { item: TopicItem; topic: Topic }>();
    this.markers = new Set<string>();

    this.revision = null;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.lastTopic = null;
    this.loadMore = false;
    this.moreLocal = true;
    this.moreRemote = true;
    this.init(revision);
  }

  private async init(revision: number) {
    const { guid } = this;
    this.nextRevision = revision;
    this.revision = this.getChannelTopicRevision();
    if (this.revision == null) {
      this.moreLocal = false;
    } else {
      this.moreLocal = true;
    }

    // load markers
    const values = await this.store.getMarkers(guid);
    values.forEach((value) => {
      this.markers.add(value);
    });

    // load map of topics
    const topics = await this.getLocalChannelTopics(null);
    topics.forEach(({ topicId, item }) => {
      const topic = this.setTopic(topicId, item);
      this.topicEntries.set(topicId, { item, topic });

      // identify cached windows
      if (!this.lastTopic || this.lastTopic.position > item.detail.created || (this.lastTopic.position === item.detail.created && this.lastTopic.topicId > topicId)) {
        this.lastTopic = {topicId, position: item.detail.created};
      }
    });
    this.moreLocal = Boolean(this.lastTopic);
    this.loadMore = !this.moreLocal;
    this.emitTopics();

    this.unsealAll = true;
    this.syncing = false;
    await this.sync();
  }


  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      const { guid, node, secure, token, channelTypes } = this;
      while ((this.loadMore || this.unsealAll || this.nextRevision) && !this.closing && this.connection) {
        if (this.nextRevision && this.revision !== this.nextRevision) {
          const nextRev = this.nextRevision;
          try {
    
            // get delta
  
              // forEach
                // get detail
                // if in window getEntry
                // if out update store

            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`topic revision: ${nextRev}`);
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          }
        }

        if (this.revision === this.nextRevision) {
          this.nextRevision = null;
        }

        if (this.loadMore) {
          try {
            if (this.moreLocal) {
              const topics = await this.getLocalChannelTopics(this.lastTopic);
              topics.forEach(({ topicId, item }) => {
                const topic = this.setTopic(topicId, item);
                this.topicEntries.set(topicId, { item, topic });

                // identify cached windows
                if (!this.lastTopic || this.lastTopic.position > item.detail.created || (this.lastTopic.position === item.detail.created && this.lastTopic.topicId > topicId)) {
                  this.lastTopic = {topicId, position: item.detail.created};
                }
              });
              this.moreLocal = Boolean(topics.length);
            } else if (this.moreRemote) {
              const delta = this.revision ? await this.getRemoteChannelTopics(null, this.revision.marker, null) : await this.getRemoteChannelTopics(null, null, null);
        console.log(delta);
              for (const entity of delta.topics) {
                const { id, revision, data } = entity;
                if (data) {
                  const { topicDetail } = data;
                  const detail = topicDetail ? topicDetail : await getRemoteChannelTopicDetail(id);
                } else {
                  // remove topic
                }
            }
            this.loadMore = false;
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          } 
        }

        if (this.unsealAll) {

          // unseal stuff

          this.unsealAll = false;
          this.emitTopics();
        }
      }

      this.syncing = false;
    }
  }

  public async addTopic(sealed: boolean, type: string, subject: (assetId: {assetId: string, transform: string}[]) => any, files: AssetSource[]) {
    return '';
  }

  public async setTopicSubject(topicId: string, type: string, subject: (assets: {assetId: string, transform: string}[]) => any, files: AssetSource[]) {}

  public async removeTopic(topicId: string) {}

  public async setUnreadChannel() {}

  public async clearUnreadChannel() {}

  public async getTopicAssetUrl(topicId: string, assetId: string, progress: (percent: number) => boolean) {
    return '';
  }

  public async flagTopic(topicId: string) {}

  public async setBlockTopic(topicId: string) {}

  public async clearBlockTopic(topicId: string) {}




  public async viewMoreTopics() {
    this.loadMore = true;
    await this.sync();
  }

  public addTopicListener(ev: (topics: Topic[]) => void) {
    this.emitter.on('topic', ev);
    const topics = Array.from(this.topicEntries, ([topicId, entry]) => entry.topic);
    ev(topics);
  }
  public removeTopicListener(ev: (topics: Topic[]) => void) {
    this.emitter.off('topic', ev);
  }

  private emitTopics() {
    const topics = Array.from(this.topicEntries, ([topicId, entry]) => entry.topic);
    this.emitter.emit('topic', topics);
  }

  public addStatusListener(ev: (status: string) => void) {
    this.emitter.on('status', ev);
    const status = this.connection ? 'connected' : 'disconnected'
    ev(status);
  }

  public removeStatusListener(ev: (status: string) => void) {
    this.emitter.off('status', ev);
  }

  public disconnect(cardId: string | null, channelId: string) {
    if (cardId === this.cardId && channelId === this.channelId) {
      this.connection = null;
      this.emitStatus();
    }
  }

  public async setRevision(cardId: string | null, channelId: string, revision: number) {
    if (cardId === this.cardId && channelId === this.channelId) {
      this.nextRevision = revision;
      await this.sync();
    }
  }

  public async setSealEnabled(enable: boolean) {
    this.sealEnabled = enable;
    this.unsealAll = true;
    await this.sync();
  }

  public async setChannelKey(cardId: string | null, channelId: string, channelKey: string) {
    if (cardId === this.cardId && channelId === this.channelId) {
      this.channelKey = channelKey;
      this.unsealAll = true;
      await this.sync();
    }
  }

  public async close() {
    this.closing = true;
    while (this.syncing) {
      await new Promise((r) => setTimeout(r, CLOSE_POLL_MS));
    } 
  }

  private emitStatus() {
    const status = this.connection ? 'connected' : 'disconnected'
    ev(status);
  }

  private setTopic(topicId: string, item: TopicItem): Topic {
    const topicData = item.sealed ? item.unsealedDetail : item.detail.data;
    return {
      topicId,
      guid: item.detail.guid,
      blocked: this.isTopicBlocked(topicId),
      sealed: item.detail.sealed,
      dataType: item.detail.dataType,
      data: topicData,
      created: item.detail.created,
      updated: item.detail.updated,
      status: item.detail.status,
      transform: item.detail.transform,
      assets: item.detail.assets.map(asset => {
        const { assetId, type, encrypted, transform, extension } = asset;
        return { assetId, type, encrypted, transform, extension };
      }),
    }
  }   

  private async getTopicEntry(topicId: string) {
    const { cardId, channelId, guid } = this;
    const entry = this.topicEntries.get(topicId);
    if (entry) {
      return entry;
    }     
    const item = JSON.parse(JSON.stringify(defaultTopicItem));
    const topic = this.setTopic(topicId, item);
    const topicEntry = { item, topic };
    this.topicEntries.set(topicId, topicEntry);
    try { 
      await this.store.addChannelTopic(topicId, item);
    } catch (err) {
      log.error(err);
    }
    return topicEntry;
  } 

  private async getChannelTopicRevision() {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      return await this.store.getContactCardChannelTopicRevision(guid, cardId, channelId);
    } else {
      return await this.store.getContentChannelTopicRevision(guid, channelId);
    }
  }

  private async setChannelTopicRevision(sync: { revision: number, marker: number}) {
    const { guid, cardId, channelId, revision } = this;
    if (cardId) {
      await this.store.setContactCardChannelTopicRevision(guid, cardId, channelId, sync);
    }
    else {
      await this.store.setContentChannelTopicRevision(guid, channelId, sync);
    }
  }

  private async getLocalChannelTopics(offset: {topicId: string, position: number}) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      return await this.store.getContactCardChannelTopics(guid, cardId, channelId, BATCH_COUNT, offset);  
    } else {
      return await this.store.getContentChannelTopics(guid, channelId, BATCH_COUNT, offset);
    }
  }

  private async addChannelTopic(topicId: string, item: TopicItem) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      await this.store.addContactCardChannelTopic(guid, cardId, channelId, topicId, item);
    } else {
      await this.store.addContentChannelTopic(guid, channelId, topicId, item);
    }
  }
  
  private async removeChannelTopic(topicId: string) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      await this.store.removeContactCardChannelTopic(guid, cardId, channelId, topicId);
    } else {
      await this.store.removeContentChannelTopic(guid, channelId, topicId);
    }
  }

  private async getRemoteChannelTopics(revision: number | null, begin: number | null, end: number | null) {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected channel');
    }
    const { node, secure, token } = this.connection
    if (cardId) {
      return await getContactChannelTopics(node, secure, token, channelId, revision, BATCH_COUNT, begin, end);
    } else {
      return await getChannelTopics(node, secure, token, channelId, revision, BATCH_COUNT, begin, end);
    }
  }

  private async getRemoteChannelTopicDetail(topicId: string) {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected channel');
    }
    const { node, secure, token } = this.connection
    if (cardId) {
      return await getContactChannelTopicDetail(node, secure, token, cardId, channelId, topicId);
    } else {
      return await getChannelTopicDetail(node, secure, token, channelId, topicId);
    }
  } 

  private isTopicBlocked(topicId: string): boolean {
    const card = this.cardId ? `"${cardId}"` : 'null';
    const channel = this.channelId ? `"${channelId}"` : 'null';
    const value = `{ "marker": "blocked_topic", "cardId": "${card}", "channelId": "${channel}, "topicId": "${topicId}", "tagId": null }`;
    return this.markers.has(value);
  }

  private async setTopicBlocked(topicId: string) {
    const card = this.cardId ? `"${cardId}"` : 'null';
    const channel = this.channelId ? `"${channelId}"` : 'null';
    const value = `{ "marker": "blocked_topic", "cardId": "${card}", "channelId": "${channel}, "topicId": "${topicId}", "tagId": null }`;
    this.markers.add(value);
    await this.store.setMarker(this.guid, value);
  }

  private async clearTopicBlocked(topicId: string) {
    const card = this.cardId ? `"${cardId}"` : 'null';
    const channel = this.channelId ? `"${channelId}"` : 'null';
    const value = `{ "marker": "blocked_topic", "cardId": "${card}", "channelId": "${channel}, "topicId": "${topicId}", "tagId": null }`;
    this.markers.delete(value);
    await this.store.clearMarker(this.guid, value);
  }

}
