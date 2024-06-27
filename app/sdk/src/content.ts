import { EventEmitter } from 'events';
import { type Content, type Channel, type Topic, type Asset } from './types';

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

  public async addChannel(type: string, subject: string, cardIds: string[]): Promise<string> {
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

  public async addTopic(channelId: string, type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(channelId: string, topicId: string): Promise<void> {
  }

  public async setTopicSubject(channelId: string, topicId: string, type: string, subject: string): Promise<void> {
  }

  public async getTopics(channelId: string, revision: number, count: number, begin: number, end: number): Promise<Topic[]> {
    return [];
  }

  public async getTopic(channelId: string, topicId: string): Promise<Topic> {
    return {};
  }

  public getTopicAssetUrl(channelId: string, topicId: string, assetId: string): string {
    return '';
  }
}

