import { EventEmitter } from 'eventemitter3';
import type { Focus } from './api';
import type { Topic, Asset, AssetSource, Participant } from './types';
import type { Logging } from './logging';
import { Store } from './store';
import { Crypto } from './crypto';

export class FocusModule implements Focus {
  private cardId: string | null;
  private channelId: string;
  private log: Logging;
  private emitter: EventEmitter;
  private crypto: Crypto | null;
  private store: Store;
  private guid: string;
  private connection: { node: string; secure: boolean; token: string } | null;

  constructor(log: Logging, store: Store, crypto: Crypto | null, cardId: string | null, channelId: string, guid: string, connection: { node: string; secure: boolean; token: string } | null) {
    this.cardId = cardId;
    this.channelId = channelId;
    this.log = log;
    this.emitter = new EventEmitter();
    this.store = store;
    this.crypto = crypto;
    this.guid = guid;
    this.connection = connection;
  }

  public addTopicListener(ev: (topics: Topic[]) => void) {}
  public removeTopicListener(ev: (topics: Topic[]) => void) {}

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

}
