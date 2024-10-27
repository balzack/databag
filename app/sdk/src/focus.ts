import { EventEmitter } from 'eventemitter3';
import type { Focus } from './api';
import type { Topic, Asset, Participant } from './types';
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

  public async addTopic(type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(topicId: string): Promise<void> {}

  public async setTopicSubject(topicId: string, subject: string): Promise<void> {}

  public async setTopicSort(topicId: string, sort: number): Promise<void> {}

  public async addTag(topicId: string, type: string, subject: string): Promise<string> {
    return '';
  }

  public async removeTag(cardId: string, tagId: string): Promise<void> {}

  public async setTagSubject(topicId: string, tagId: string, subject: string): Promise<void> {}

  public async setTagSort(topicId: string, tagId: string, sort: number): Promise<void> {}

  public async viewMoreTopics(): Promise<void> {}

  public async viewMoreTags(topicId: string): Promise<void> {}

  public async setUnreadChannel(cardId: string, channelId: string): Promise<void> {}

  public async clearUnreadChannel(cardId: string, channelId: string): Promise<void> {}

  public getTopicAssetUrl(topicId: string, assetId: string): string {
    return '';
  }

  public async addParticipantAccess(name: string): Promise<Participant> {
    return { id: '', name: '', node: '', secure: false, token: '' };
  }

  public async removeParticipantAccess(repeaterId: string): Promise<void> {}

  public async flagTopic(topicId: string): Promise<void> {}

  public async flagTag(topicId: string, tagId: string): Promise<void> {}

  public async setBlockTopic(topicId: string): Promise<void> {}

  public async setBlockTag(topicId: string, tagId: string): Promise<void> {}

  public async clearBlockTopic(topicId: string): Promise<void> {}

  public async clearBlockTag(topicId: string, tagId: string): Promise<void> {}

  public addTopicListener(ev: (topics: Topic[]) => void): void {}

  public removeTopicListener(ev: (topics: Topic[]) => void): void {}
}
