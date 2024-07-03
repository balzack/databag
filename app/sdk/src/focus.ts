import { EventEmitter } from 'eventemitter3';
import type { Identity, Contact, Content, Focus } from './api';
import type { Topic, Asset, Repeater } from './types';

export class FocusModule implements Focus {

  private identity: Identity;
  private contact: Contact;
  private content: Content;
  private cardId: string | null;
  private channelId: string;
  private emitter: EventEmitter;

  constructor(identity: Identity, contact: Contact, content: Content, cardId: string | null, channelId: string) {
    this.identity = identity;
    this.contact = contact;
    this.content = content;
    this.cardId = cardId;
    this.channelId = channelId;
    this.emitter = new EventEmitter();
  }

  public blur(): void {
  }
  
  public async addTopic(type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(topicId: string): Promise<void> {
  }

  public async setTopicSubject(topicId: string, subject: string): Promise<void> {
  }

  public async addTag(topicId: string, type: string, subject: string): Promise<string> {
    return '';
  }

  public async removeTag(cardId: string, tagId: string): Promise<void> {
  }

  public async setTagSubject(topicId: string, tagId: string, subject: string): Promise<void> {
  }
  
  public async viewMoreTopics(): Promise<void> {
  }

  public async viewMoreTags(topicId: string): Promise<void> {
  }

  public async setUnreadChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async clearUnreadChannel(cardId: string, channelId: string): Promise<void> {
  }
  
  public getTopicAssetUrl(topicId: string, assetId: string): string {
    return '';
  }
  
  public async addRepeaterAccess(name: string): Promise<Repeater> {
    return { id: '', guid: '', name: '', server: '', token: '' };
  }

  public async removeRepeaterAccess(repeaterId: string): Promise<void> {
  }

  public async flagTopic(topicId: string): Promise<void> {
  }

  public async flagTag(topicId: string, tagId: string): Promise<void> {
  }

  public async setBlockTopic(topicId: string): Promise<void> {
  }

  public async setBlockTag(topicId: string, tagId: string): Promise<void> {
  }

  public async clearBlockTopic(topicId: string): Promise<void> {
  }

  public async clearBlockTag(topicId: string, tagId: string): Promise<void> {
  }
  
  public addTopicListener(ev: (topics: Topic[]) => void): void {
  }

  public removeTopicListener(ev: (topics: Topic[]) => void): void {
  }

}
