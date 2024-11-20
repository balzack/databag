import { EventEmitter } from 'eventemitter3';
import type { Focus } from './api';
import { TopicItem } from './item';
import type { Topic, Asset, AssetSource, Participant } from './types';
import type { Logging } from './logging';
import { Store } from './store';
import { Crypto } from './crypto';

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
  private position: { topicId: string, position: number } | null;
  private moreLocal: boolean;
  private moreRemote: boolean;

  // view of topics 
  private topicEntries: Map<string, { item: TopicItem; topic: Topic }>;

  constructor(log: Logging, store: Store, crypto: Crypto | null, cardId: string | null, channelId: string, guid: string, connection: { node: string; secure: boolean; token: string } | null, revision: number) {
    this.cardId = cardId;
    this.channelId = channelId;
    this.log = log;
    this.emitter = new EventEmitter();
    this.store = store;
    this.crypto = crypto;
    this.guid = guid;
    this.connection = connection;

    this.topicEntries = new Map<string, { item: TopicItem; topic: Topic }>();

    this.revision = null;
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
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

    // load map of topics
    const topics = await this.getChannelTopics();
    topics.forEach(({ topicId, item }) => {
      const topic = this.setTopic(topicId, item);
      this.topicEntries.set(topicId, { item, topic });
    });
    this.emitTopics();

    this.unsealAll = true;
    this.syncing = false;
    await this.sync();
  }

  public addTopicListener(ev: (topics: Topic[]) => void) {
    this.emitter.on('topic', ev);
    const topics = Array.from(this.topicEntries, ([topicId, entry]) => entry.topic);
    ev(topics);
  }
  public removeTopicListener(ev: (topics: Topic[]) => void) {
    this.emitter.of('topic', ev);
  }

  public async disconnect(cardId: string | null, channelId: string) {
    if (cardId === this.cardId && channelId === this.channelId) {
      this.connection = null;
    }
  }

  public async setRevision(cardId: string | null, channelId: string, revision: number) {
    if (cardId === this.cardId && channelId === this.channelId) {
      // sync
    }
  }

  public async close() {}

  public async addTopic(sealed: boolean, type: string, subject: (assetId: {assetId: string, transform: string}[]) => any, files: AssetSource[]) {
    return '';
  }

  public async setTopicSubject(topicId: string, type: string, subject: (assets: {assetId: string, transform: string}[]) => any, files: AssetSource[]) {}

  public async removeTopic(topicId: string) {}

  public async viewMoreTopics() {}

  public async setUnreadChannel() {}

  public async clearUnreadChannel() {}

  public async getTopicAssetUrl(topicId: string, assetId: string, progress: (percent: number) => void) {
    return '';
  }

  public async flagTopic(topicId: string) {}

  public async setBlockTopic(topicId: string) {}

  public async clearBlockTopic(topicId: string) {}

  private setTopic(topicId: string, item: TopicItem): Topic {
    const topicData = item.sealed ? item.unsealedDetail : item.detail.data;
    return {
      topicId,
      guid: item.detail.guid,
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

  private emitTopics() {
    const topics = Array.from(this.topicEntries, ([topicId, entry]) => entry.topic);
    this.emitter.emit('topic', topics);
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

  private async getChannelTopics() {
    const { guid, cardId, channelId, position } = this;
    if (cardId) {
      return await this.store.getContactCardChannelTopics(guid, cardId, channelId, BATCH_COUNT, position);  
    } else {
      return await this.store.getContentChannelTopics(guid, channelId, BATCH_COUNT, position);
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
}
