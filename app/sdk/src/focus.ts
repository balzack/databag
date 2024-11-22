import { EventEmitter } from 'eventemitter3';
import type { Focus } from './api';
import type { TopicItem} from './items';
import type { Topic, Asset, AssetSource, Participant } from './types';
import type { Logging } from './logging';
import { Store } from './store';
import { Crypto } from './crypto';
import { defaultTopicItem } from './items';
import { getChannelTopics } from './net/getChannelTopics';
import { getChannelTopicDetail } from './net/getChannelTopicDetail';
import { getContactChannelTopics } from './net/getContactChannelTopics'
import { getContactChannelTopicDetail } from './net/getContactChannelTopicDetail';

const BATCH_COUNT = 64;
const MIN_LOAD_SIZE = 32;
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
  private cacheView: {revision: number | null, marker: number | null};
  private storeView: {topicId: string, position: number} | null;
  private complete: boolean;
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

    this.cacheView = null;
    this.storeView = { revision: null, marker: null };
    this.syncing = true;
    this.closing = false;
    this.nextRevision = null;
    this.loadMore = false;
    this.complete = false;
    this.init(revision);
  }

  private async init(revision: number) {
    const { guid } = this;
    this.nextRevision = revision;
    this.storeView = this.getChannelTopicRevision();

    // load markers
    const values = await this.store.getMarkers(guid);
    values.forEach((value) => {
      this.markers.add(value);
    });

    this.emitTopics();
    this.unsealAll = true;
    this.loadMore = true;
    this.syncing = false;
    await this.sync();
  }

  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      const { guid, node, secure, token, channelTypes } = this;
      while ((this.loadMore || this.unsealAll || this.nextRevision) && !this.closing && this.connection) {
        if (this.nextRevision && this.storeView.revision !== this.nextRevision) {
          const nextRev = this.nextRevision;
          try {
            const delta = await this.getRemoteChannelTopics(this.storeView.revision, null, this.storeView.marker);
            for (const entity of delta.topics) {
              const { id, revision, data } = entity;
              if (data) {
                const { detailRevision, topicDetail } = data;
                if (!this.cacheView || this.cacheView.position > detail.created || (this.cacheView.position === detail.created && this.cacheView.topicId >= topicId)) {
                  const entry = await this.getTopicEntry(id);
                  if (detailRevision > entry.item.detail.revision) {
                    const detail = topicDetail ? topicDetail : await getRemoteChannelTopicDetail(id);
                    entry.item.detail = this.getTopicDetail(detail, detailRevision);
                    entry.item.unsealedDetail = null;
                    entry.item.position = detail.created;
                    await this.unsealTopicDetail(entry.item);
                    entry.topic = this.setTopic(id, entry.item);
                    await this.setLocalChannelTopicDetail(id, detail, entry.item.unsealedDetail, detail.created);
                  }
                } else {
                  const item = { detail, position: detail.created, unsealedDetail: null };
                  await this.store.addLocalChannelTopic(id, item);
                }
              } else {
                this.topicEntries.delete(id);
                await this.store.removeLocalChannelTopic(id);
              }
            }
            this.storeView = { revision: nextRev, marker: delta.marker };
            await this.setChannelTopicRevision(this.storeView);

            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.emitTopics();
            this.log.info(`topic revision: ${nextRev}`);
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          }
        }

        if (this.storeView.revision === this.nextRevision) {
          this.nextRevision = null;
        }

        if (this.loadMore) {
          try {
            if (this.cacheView) {
              const topics = await this.getLocalChannelTopics(this.cacheView);
              for (const entry of topics) {
                const { topicId, item } = entry;
                if (await this.unsealTopicDetail(item)) {
                  await this.setLocalChannelTopicUnsealedDetail(topicId, item.unsealedDetail);
                }
                const topic = this.setTopic(topicId, item);
                this.topicEntries.set(topicId, { item, topic });
                if (this.cacheView.position > item.detail.created || (this.cacheView.position === item.detail.created && this.cacheView.topicId > topicId)) {
                  this.cacheView = {topicId, position: item.detail.created};
                }
              }
              if (topics.length == 0) {
                this.cacheView = null;
              }
              if (topics.length > MIN_LOAD_SIZE) {
                this.loadMore = false;
              }
            } else if (!this.storeView.revision || this.storeView.marker) {
              const delta = await this.getRemoteChannelTopics(null, this.storeView.marker, null);
              for (const entity of delta.topics) {
                const { id, revision, data } = entity;
                if (data) {
                  const { detailRevision, topicDetail } = data;
                  const entry = await this.getTopicEntry(id);
                  if (detailRevision > entry.item.detail.revision) {
                    const detail = topicDetail ? topicDetail : await getRemoteChannelTopicDetail(id);
                    entry.item.detail = this.getTopicDetail(detail, detailRevision);
                    entry.item.unsealedDetail = null;
                    entry.item.position = detail.created;
                    await this.unsealTopicDetail(entry.item);
                    entry.topic = this.setTopic(id, entry.item);
                    await this.setLocalChannelTopicDetail(id, detail, entry.item.unsealedDetail, detail.created);
                  }
                } else {
                  log.error('ignoring unexpected delete entry on initial load');
                }
              }
              if (delta.topics.length === 0) {
                this.completed = true;
              }
              const rev = this.storeView.revision ? this.storeView.revision : delta.revision;
              const mark = delta.topics.length ? delta.marker : null;
              this.storeView = { revision: rev, marker: mark };
              await this.setChannelTopicRevision(this.storeView);
              this.loadMore = false;
            } else {
              this.loadMore = false;
            }
            this.emitTopics();
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          } 
        }

        if (this.unsealAll) {
          for (const [topicId, entry] of this.topicEntries.entries()) {
            try {
              const { item } = entry;
              if (await this.unsealTopicDetail(item)) {
                await this.setLocalChannelTopicUnsealedDetail(guid, topicId, item.unsealedDetail);
                entry.topic = this.setTopic(topicId, item);
              }
            } catch (err) {
              this.log.warn(err);
            }
          }

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


  private async unsealTopicDetail(item: TopicItem): Promise<boolean> {
    return false;
  }

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

  private getTopicData(item: TopicItem): any {
    // construct data protion from data
    return {};
  }

  private getTopicAssets(item: TopicItem): AssetItem[] {
    // construct asset portion from data
    return [];
  }

  private setTopic(topicId: string, item: TopicItem): Topic {
    return {
      topicId,
      guid: item.detail.guid,
      blocked: this.isTopicBlocked(topicId),
      sealed: item.detail.sealed,
      dataType: item.detail.dataType,
      data: this.getTopicData(item),
      created: item.detail.created,
      updated: item.detail.updated,
      status: item.detail.status,
      transform: item.detail.transform,
      assets: this.getTopicAssets(item).map(asset => {
        const { assetId, type, encrypted, transform, extension } = asset;
        return { assetId, type, encrypted, transform, extension };
      }),
    }
  }   

  private async getTopicDetail(entity: TopicDetailEntity, revision: number) {
    const { guid, dataType, data, created, updated, status, transform } = entity;
    return {
      revision,
      guid,
      sealed: false, //todo
      data: {}, //todo
      assets: [], //todo
      created,
      updated,
      status,
      transform,
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
    await this.addLocalChannelTopic(topicId, item);
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

  private async addLocalChannelTopic(topicId: string, item: TopicItem) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      await this.store.addContactCardChannelTopic(guid, cardId, channelId, topicId, item);
    } else {
      await this.store.addContentChannelTopic(guid, channelId, topicId, item);
    }
  }
  
  private async removeLocalChannelTopic(topicId: string) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      await this.store.removeContactCardChannelTopic(guid, cardId, channelId, topicId);
    } else {
      await this.store.removeContentChannelTopic(guid, channelId, topicId);
    }
  }

  private async setLocalChannelTopicDetail(topicId: string, detail: TopicDetail, unsealedDetail: any, position: number) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      await this.store.setContactCardChannelTopicDetail(guid, cardId, channelId, topicId, detail, unsealedDetail, position);
    } else {
      await this.store.setContentChannelTopicDetail(guid, channelId, topicId, unsealedDetail);
    }
  }

  private async setLocalChannelTopicUnsealedDetail(topicId: string, unsealedDetail: any) {
    const { guid, cardId, channelId } = this;
    if (cardId) {
      await this.store.setContactCardChannelTopicUnsealedDetail(guid, cardId, channelId, topicId, unsealedDetail);
    } else {
      await this.store.setContentChannelTopicDetail(guid, channelId, topicId, unsealedDetail);
    }
  }

  private async getRemoteChannelTopics(revision: number | null, begin: number | null, end: number | null) {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected channel');
    }
    const { node, secure, token } = this.connection
    if (cardId) {
      return await getContactChannelTopics(node, secure, token, channelId, revision, (begin || !revision) ? BATCH_COUNT : null, begin, end);
    } else {
      return await getChannelTopics(node, secure, token, channelId, revision, (begin || !revision) ? BATCH_COUNT : null, begin, end);
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
    const { cardId, channelId } = this;
    const card = cardId ? `"${cardId}"` : 'null';
    const channel = channelId ? `"${channelId}"` : 'null';
    const value = `{ "marker": "blocked_topic", "cardId": "${card}", "channelId": "${channel}, "topicId": "${topicId}", "tagId": null }`;
    return this.markers.has(value);
  }

  private async setTopicBlocked(topicId: string) {
    const { guid, cardId, channelId } = this;
    const card = cardId ? `"${cardId}"` : 'null';
    const channel = channelId ? `"${channelId}"` : 'null';
    const value = `{ "marker": "blocked_topic", "cardId": "${card}", "channelId": "${channel}, "topicId": "${topicId}", "tagId": null }`;
    this.markers.add(value);
    await this.store.setMarker(guid, value);
  }

  private async clearTopicBlocked(topicId: string) {
    const { guid, cardId, channelId } = this;
    const card = cardId ? `"${cardId}"` : 'null';
    const channel = channelId ? `"${channelId}"` : 'null';
    const value = `{ "marker": "blocked_topic", "cardId": "${card}", "channelId": "${channel}, "topicId": "${topicId}", "tagId": null }`;
    this.markers.delete(value);
    await this.store.clearMarker(guid, value);
  }

}
