import { EventEmitter } from 'eventemitter3';
import type { Focus } from './api';
import type { TopicItem} from './items';
import type { Topic, Asset, AssetSource, HostingMode, Participant } from './types';
import type { Logging } from './logging';
import { Store } from './store';
import { Crypto } from './crypto';
import { defaultTopicItem } from './items';
import { getChannelTopics } from './net/getChannelTopics';
import { getChannelTopicDetail } from './net/getChannelTopicDetail';
import { getContactChannelTopics } from './net/getContactChannelTopics'
import { getContactChannelTopicDetail } from './net/getContactChannelTopicDetail';
import { addChannelTopic } from './net/addChannelTopic';
import { addContactChannelTopic } from './net/addContactChannelTopic';
import { setChannelTopicSubject } from './net/setChannelTopicSubject';
import { addContactChannelTopicSubject } from './net/setContactChannelTopicSubject';

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
  private localComplete: boolean;
  private remoteComplete: boolean;
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
    this.localComplete = false;
    this.remoteComplete = false;
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
        if (this.loadMore) {
          try {
            if (!this.localComplete) {
              const topics = await this.getLocalChannelTopics(this.cacheView);
              for (const entry of topics) {
                const { topicId, item } = entry;
                if (await this.unsealTopicDetail(item)) {
                  await this.setLocalChannelTopicUnsealedDetail(topicId, item.unsealedDetail);
                }
                const topic = this.setTopic(topicId, item);
                this.topicEntries.set(topicId, { item, topic });
                if (!this.cacheView || this.cacheView.position > item.detail.created || (this.cacheView.position === item.detail.created && this.cacheView.topicId > topicId)) {
                  this.cacheView = {topicId, position: item.detail.created};
                }
              }
              if (topics.length == 0) {
                this.localComplete = true;
              }
              if (topics.length > MIN_LOAD_SIZE) {
                this.loadMore = false;
              }
            } else if (!this.storeView.revision || this.storeView.marker) {
              const delta = await this.getRemoteChannelTopics(null, null, this.storeView.marker);
              for (const entity of delta.topics) {
                const { id, revision, data } = entity;
                if (data) {
                  const { detailRevision, topicDetail } = data;
                  const entry = await this.getTopicEntry(id);
                  if (detailRevision > entry.item.detail.revision) {
                    const detail = topicDetail ? topicDetail : await this.getRemoteChannelTopicDetail(id);
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
                this.remoteCompleted = true;
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

        if (this.nextRevision && this.storeView.revision !== this.nextRevision) {
          const nextRev = this.nextRevision;
          try {
            const delta = await this.getRemoteChannelTopics(this.storeView.revision, this.storeView.marker, null);
            for (const entity of delta.topics) {
              const { id, revision, data } = entity;
              if (data) {
                const { detailRevision, topicDetail } = data;
                if (!this.cacheView || this.cacheView.position > detail.created || (this.cacheView.position === detail.created && this.cacheView.topicId >= topicId)) {
                  const entry = await this.getTopicEntry(id);
                  if (detailRevision > entry.item.detail.revision) {
                    const detail = topicDetail ? topicDetail : await this.getRemoteChannelTopicDetail(id);
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

  private uploadBlock(block: string, topicId: string, progress: (percent: number)=>boolean): Promise<string> {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected from channel');
    }
    const { node, secure, token } = this.connection;
    const params = `${cardId ? 'contact' : 'agent'}=${token}`
    const url = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics/${topicId}/blocks?${params}`

    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.progress = progress;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response?.assetId) {
          resolve(xhr.response.assetId)
        } else {
          reject(xhr.statusText)
        }
      };
      xhr.onerror = () => {
        reject(xhr.statusText)
      };
      xhr.send(block);
    });
  }

  private uploadFile(source: any, transforms: string[], topicId: string, progress: (percent: number)=>boolean): Promise<{assetId: string, transform: string}[]> {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected from channel');
    }
    const { node, secure, token } = this.connection;
    const params = `${cardId ? 'contact' : 'agent'}=${token}&transforms=${encodeURIComponent(JSON.stringify(transforms))}`
    const url = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics/${topicId}/assets?${params}`
    const formData = new FormData();
    formData.append('asset', source);

    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.progress = progress;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response)
        } else {
          reject(xhr.statusText)
        }
      };
      xhr.onerror = () => {
        reject(xhr.statusText)
      };
      xhr.send(formData);
    });
  }

  public async addTopic(sealed: boolean, type: string, subject: (asset: {assetId: string, context: any}[]) => any, files: AssetSource[], progress: (percent: nunber)=>boolean): Promise<string> {
    // { assets, text, textColor, textSize }
    // asset: { image: { thumb: string, full: string }}
    // asset encrypted: { encrypted: { type: string, thumb: string, parts: { blockIv: string, partId: string } } }
    // superbasictopic: '{"text":"??","textColor":"#7ed321","textSize":20}'
    // superbasictopic w/asset: '{"assets":[{"image":{"thumb":"ce543a92-8fa0-461f-8e4f-084136ee3f9c","full":"739a73b0-2e7b-47f8-9062-b6ed04215fbc"}}],"text":"asdf"}'
    // sealedtopic: '{"messageEncrypted":"rTx+oacmCEW0VlfsykZunrOY81Fuk1S4+IjIHOGnn242P1jXl8VLR8AHH2Yj6Pr540qcixy69mraVTzKD45p537zWxdglks3KrWmRlXjT9w=","messageIv":"7c8d6e453649c5bfea929d6c5e41d36d"}'

    // if not assets
      // subject callback
      // format
      // if sealed
        // encrypt
      // add confirmed topic

    if (files.length == 0) {
      const data = subject([]);
      if (sealed) {
        // encrypt
      }
      return await this.addRemoteChannelTopic(type, data, true);
    } else {
      console.log("UPLOAD?");
      const topicId = await this.addRemoteChannelTopic(type, {}, false);

      for (const asset of files) {
        const upload = await this.uploadFile(asset.source, ['ithumb;photo', 'ilg;photo'], topicId, (progress: number) => {
          console.log("PROGRESS", progress);
        });
        console.log("UPLOADED: ", upload);
      }
      return await this.setRemoteChannelTopicSubject(topicId, type, { text: 'asseted' });
    }
   
    // else
      // add unconfirmed topic
      // for each asset
        // if split
          // for each block
            // encrypt
            // upload reporting progress
        // else
          // upload reporting progress
      // subject callback
      // format
      // if sealed
        // encrypt
      // set subject and confirm
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
    if (item.detail.sealed && !item.unsealedDetail && this.sealEnabled && this.channelKey && this.crypto) {
      try {
        const { messageEncrypted, messageIv } = item.detail.data;
        const { data } = await this.crypto.aesDecrypt(messageEncrypted, messageIv, this.channelKey);
        const { message } = JSON.parse(data);
        item.unsealedDetail = message;
        return true;
      } catch (err) {
        this.log.warn(err);
      }
    }
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

  private getTopicData(item: TopicItem): { data: any, assets: AssetItem[] } {
    const topicDetail = item.detail.sealed ? item.unsealedDetail : item.detail.data;

    if (topicDetail == null) {
      return { data: null, assets: [] };
    }
    const { text, textColor, textSize, assets } = topicDetail;
    let index: number = 0;
    const assetItems = new Set<AssetItem>();
    return { data: { text, textColor, textSize }, assets: !assets ? [] : assets.map(({ encrypted, image, audio, video, binary }) => {
      if (encrypted) {
        const { type, thumb, label, extension, parts } = encrypted;
        if (thumb) {
          const asset = {
            assetIndex: index,
            mimeType: 'image/png',
            extension: 'png',
            encrypted: false,
            hosting: HostingMode.Inline,
            assetData: thumb,
          }
          assetItems.add(asset);
          index += 1;
        }
        const asset = {
          assetIndex: index,
          mimeType: type,
          extension: extension,
          encrypted: true,
          hosting: HostingMode.Split,
          assetParts: parts,
        }
        assetItems.add(asset);
        index += 1;

        if (thumb) {
          return { type, thumb: index-2, data: index-1 }
        } else {
          return { type, data: index-1 }
        }
      } else {
        const { thumb, label, full, lq, hd, extension, data } = binary || image || audio || video;
        if (thumb) {
          const asset = {
            assetIndex: index,
            mimeType: 'image/png',
            extension: 'png',
            encrypted: false,
            hosting: HostingMode.Basic,
            assetId: thumb,
          }
          assetItem.add(asset);
          index += 1;
        }
        const asset = {
          assetIndex: index,
          mimeType: image ? 'image' : audio ? 'audio' : video ? 'video' : 'binary',
          extension: extension,
          encrypted: false,
          hosting: HostingMode.Basic,
          assetId: full || hd || lq,
        }
        assetItem.add(asset);
        index += 1;

        if (thumb) {
          return { type: asset.mimeType, thumb: index-2, data: index-1 }
        } else {
          return { type, data: index-1 }
        }
      }
    })};
  }

  private setTopic(topicId: string, item: TopicItem): Topic {
    const { data, assets } = this.getTopicData(item);
    return {
      topicId,
      data,
      guid: item.detail.guid,
      blocked: this.isTopicBlocked(topicId),
      sealed: item.detail.sealed,
      dataType: item.detail.dataType,
      created: item.detail.created,
      updated: item.detail.updated,
      status: item.detail.status,
      transform: item.detail.transform,
      assets: assets.map(asset => {
        const { assetId, mimeType, hosting, extension } = asset;
        return { assetId, mimeType, hosting, extension };
      }),
    }
  }   

  private getTopicDetail(entity: TopicDetailEntity, revision: number) {
    const { guid, dataType, data, created, updated, status, transform } = entity;
    return {
      revision,
      guid,
      sealed: dataType == 'sealedtopic',
      data: this.parse(data),
      dataType,
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
      return await getContactChannelTopicDetail(node, secure, token, channelId, topicId);
    } else {
      return await getChannelTopicDetail(node, secure, token, channelId, topicId);
    }
  } 

  private async addRemoteChannelTopic(dataType: string, data: any, confirm: boolean) {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected channel');
    }
    const { node, secure, token } = this.connection;
    if (cardId) {
      return await addContactChannelTopic(node, secure, token, channelId, dataType, data, confirm);
    } else {
      return await addChannelTopic(node, secure, token, channelId, dataType, data, confirm);
    }
  }

  private async setRemoteChannelTopicSubject(topicId: string, dataType: string, data: any) {
    const { cardId, channelId, connection } = this;
    if (!connection) {
      throw new Error('disconnected from channel');
    }
    const { node, secure, token } = this.connection;
    if (cardId) {
      return await setContactChannelTopicSubject(node, secure, token, channelId, topicId, dataType, data);
    } else {
      return await setChannelTopicSubject(node, secure, token, channelId, topicId, dataType, data);
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

  private parse(data: string | null): any {
    if (data) {
      try {
        if (data == null) {
          return null;
        }
        return JSON.parse(data);
      } catch (err) {
        this.log.warn('invalid channel data');
      }
    }
    return {};
  }
}
