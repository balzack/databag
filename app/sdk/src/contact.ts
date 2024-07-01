import { EventEmitter } from 'events';
import { type Contact } from './api';
import { type Card, type Topic, type Asset, type Repeater} from './types';

export class ContactModule implements Contact {

  private token: string;
  private url: string;
  private sync: (flag: boolean) => void;
  private emitter: EventEmitter;

  constructor(token: string, url: string, sync: (flag: boolean) => void) {
    this.token = token;
    this.url = url;
    this.sync = sync;
    this.emitter = new EventEmitter();
  }

  public addCardListener(ev: (cards: Card[]) => void): void {
    this.emitter.on('card', ev);
  }

  public removeCardListener(ev: (cards: Card[]) => void): void {
    this.emitter.off('card', ev);
  }

  public async setRevision(rev: number): Promise<void> {
  }

  public async resync(): Promise<void> {
  }

  public async addCard(server: string, guid: string): Promise<string> {
    return '';
  }

  public async removeCard(cardId: string): Promise<void> {
  }

  public async confirmCard(cardId: string): Promise<void> {
  }

  public async connectCard(cardId: string): Promise<void> {
  }

  public async disconnectCard(cardId: string): Promise<void> {
  }

  public async rejectCard(cardId: string): Promise<void> {
  }

  public async ignoreCard(cardId: string): Promise<void> {
  }

  public async resyncCard(cardId: string): Promise<void> {
  }

  public async flagCard(cardId: string): Promise<void> {
  }

  public async flagArticle(cardId: string, articleId: string): Promise<void> {
  }

  public async flagChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async flagTopic(cardId: string, channelId: string, topicId: string): Promise<void> {
  }

  public async flagTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async setBlockCard(cardId: string): Promise<void> {
  }

  public async setBlockArticle(cardId: string, articleId: string): Promise<void> {
  }

  public async setBlockChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async setBlockTopic(cardId: string, channelId: string, topicId: string): Promise<void> {
  }

  public async setBlockTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async clearBlockCard(cardId: string): Promise<void> {
  }

  public async clearBlockArticle(cardId: string, articleId: string): Promise<void> {
  }

  public async clearBlockChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async clearBlockTopic(cardId: string, channelId: string, topicId: string): Promise<void> {
  }

  public async clearBlockTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async getBlockedCards(): Promise<{ cardId: string }[]> {
    return [];
  }

  public async getBlockedChannels(): Promise<{ cardId: string, channelId: string }[]> {
    return [];
  }

  public async getBlockedTopics(): Promise<{ cardId: string, channelId: string, topicId: string }[]> {
    return [];
  }

  public async getBlockedTags(): Promise<{ cardId: string, channelId: string, topicId: string, tagId: string }[]> {
    return [];
  }

  public async getBlockedArticles(): Promise<{ cardId: string, articleId: string }[]> {
    return [];
  }

  public async removeArticle(cardId: string, articleId: string): Promise<void> {
  }

  public async removeChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async addTopic(cardId: string, channelId: string, type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(cardId: string, channelId: string, topicId: string): Promise<void> {
  }

  public async setTopicSubject(cardId: string, channelId: string, topicId: string, type: string, subject: string): Promise<void> {
  }

  public async addTag(cardId: string, channelId: string, topicId: string, type: string, value: string): Promise<string> {
    return '';
  }

  public async removeTag(cardId: string, tagId: string): Promise<void> {
    return;
  }

  public getTopicAssetUrl(cardId: string, channelId: string, topicId: string, assetId: string): string {
    return '';
  }

  public getCardImageUrl(cardId: string): string {
    return '';
  }

  public async addRepeaterAccess(cardId: string, channelId: string, name: string): Promise<Repeater> {
    return { id: '', guid: '', name: '', server: '', token: '' };
  }

  public async removeRepeaterAccess(cardId: string, channelId: string, repeaterId: string): Promise<void> {
  }

}

