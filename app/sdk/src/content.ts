import { EventEmitter } from 'events';
import { type Content } from './api';
import type { Channel, Topic, Asset, Repeater } from './types';

export class ContentModule implements Content {

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

  public addChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.on('channel', ev);
  }

  public removeChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.off('channel', ev);
  }

  public async setRevision(rev: number): Promise<void> {
  }

  public async resync(): Promise<void> {
  }

  public async addChannel(type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string> {
    return '';
  }

  public async removeChannel(channelId: string): Promise<void> {
  }

  public async setChannelSubject(channelId: string, type: string, subject: string): Promise<void> {
  }

  public async setChannelCard(channelId: string, cardId: string): Promise<void> {
  }

  public async clearChannelCard(channelId: string, cardId: string): Promise<void> {
  }

  public async setChannelGroup(channelId: string, groupId: string): Promise<void> {
  }

  public async clearChannelGroup(channelId: string, groupId: string): Promise<void> {
  }

  public async addTopic(channelId: string, type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(channelId: string, topicId: string): Promise<void> {
  }

  public async flagTopic(channelId: string, topicId: string): Promise<void> {
  }

  public async setTopicSubject(channelId: string, topicId: string, type: string, subject: string): Promise<void> {
  }

  public async addTag(channelId: string, topicId: string, type: string, value: string): Promise<string> {
    return '';
  }

  public async removeTag(channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async flagTag(channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async setBlockTopic(channelId: string, topicId: string): Promise<void> {
  }

  public async setBlockTag(channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async clearBlockTopic(channelId: string, topicId: string): Promise<void> {
  }

  public async clearBlockTag(channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async getBlockedTopics(): Promise<{ channelId: string, topicId: string }[]> {
    return [];
  }

  public async getBlockedTags(): Promise<{ channelId: string, topicId: string, tagId: string }[]> {
    return [];
  }

  public getTopicAssetUrl(channelId: string, topicId: string, assetId: string): string {
    return '';
  }

  public async viewMoreTopics(cardId: string, channelId: string): Promise<number> {
    return 0;
  }

  public async setUnreadChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async clearUnreadChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async addRepeaterAccess(channelId: string, name: string): Promise<Repeater> {
    return { id: '', guid: '', name: '', server: '', token: '' };
  }

  public async removeRepeaterAccess(channelId: string, repeaterId: string): Promise<void> {
  }
}

