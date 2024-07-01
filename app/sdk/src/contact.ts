import { EventEmitter } from 'events';
import { type Contact } from './api';
import { type Card, type Topic, type SignedMessage, type ContactStatus, type Asset, type Repeater} from './types';

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

  public async addCard(message: SignedMessage): Promise<string> {
    return '';
  }

  public async removeCard(cardId: string): Promise<void> {
  }

  public async setCardConnecting(cardId: string): Promise<void> {
  }

  public async setCardConnected(cardId: string, token: string, rev: number): Promise<void> {
  }

  public async setCardConfirmed(cardId: string): Promise<void> {
  }

  public async getCardOpenMessage(cardId: string): Promise<SignedMessage> {
    return { message: '', keyType: '', publicKey: '', signature: '', signatureType: '' };
  }

  public async setCardOpenMessage(server: string, message: SignedMessage): Promise<ContactStatus> {
    return { token: '', profileRevision: 0, articleRevision: 0, channelRevision: 0, viewRevision: 0, status: '' };
  }
 
  public async getCardCloseMessage(cardId: string): Promise<SignedMessage> {
    return { message: '', keyType: '', publicKey: '', signature: '', signatureType: '' };
  }

  public async setCardCloseMessage(server: string, message: SignedMessage): Promise<void> {
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

  public async resyncCard(cardId: string): Promise<void> {
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

