import { EventEmitter } from 'eventemitter3';
import type { Contact, Logging } from './api';
import type { Card, Topic, Asset, Tag, Profile, Participant} from './types';
import type { CardEntity } from './entities';
import type { ArticleRevision, ArticleDetail, ChannelRevision, ChannelSummary, ChannelDetail, CardRevision, CardNotification, CardProfile, CardDetail } from './items';
import { defaultCardItem } from './items';
import { Store } from './store';
import { getCards } from './net/getCards';
import { getCardProfile } from './net/getCardProfile';
import { getCardDetail } from './net/getCardDetail';
import { setCardProfile } from './net/setCardProfile';
import { getContactProfile } from './net/getContactProfile';

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class ContactModule implements Contact {

  private log: Logging;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private emitter: EventEmitter;

  private store: Store;
  private revision: number;
  private nextRevision: number | null;
  private syncing: boolean;
  private closing: boolean;

  // view of cards
  private cardEntries: Map<string, { item: CardItem, card: Card }>

  // view of articles
  private articleEntries: Map<string, Map<string, { item: ArticleItem, article: Article }>>

  // view of channels
  private channelEntries: Map<string, Map<string, { item: ChannelItem, channel: Channel }>>;

  constructor(log: Logging, store: Store, guid: string, token: string, node: string, secure: boolean) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.store = store;
    this.emitter = new EventEmitter();

    this.cardEntries = new Map<string, { item: CardItem, card: Card }>();
    this.articleEntries = new Map<string, Map<string, { item: ArticleItem, article: Article }>>;
    this.channelEntries = new Map<string, Map<string, { item: ChannelItem, channel: Channel }>>;

    this.revision = 0;
    this.sycning = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();
  }

  private setCard(cardId: string, item: CardItem): Card {
    const { offsync, blocked, profile, detail } = item;
    const { guid, handle, name, description, location, imageSet, node } = profile;
    const { status, statusUpdated } = detail;
    return { cardId, offsync, blocked, status, statusUpdated, guid, handle, name, description, location, imageSet, node }; 
  }

  private setArticle(cardId: string, articleId: string, item: ArticleItem): Article {
    const { unread, blocked, detail, unsealedData } = item;
    const { dataType, sealed, data, created, updated } = detail;
    const articleData = sealed ? unsealedData : data;
    return { cardId, articleId, dataType, articleData, created, updated, status };
  }

  private setChannel(cardId: string, channelId: string, item: ChannelItem): Channel {
    const { blocked, summary, detail, unsealedChannelData, unsealedTopicData } = item;
    const { enableImage, enableAudio, enableVideo, enableBinary, members } = detail;
    const channelData = detail.sealed ? unsealedChannelData : detail.data;
    const { guid, status, transform } = summary;
    const topicData = summary.sealed ? unsealedTopicData : summary.data;

    const { pushEnabled } = members.find(({ member }) => (member === this.guid)) | {}
    const contacts = members.filter(({ member }) => (member != this.guid)).map(({ member, pushEnabled }) => { guid: member, pushEnabled });

    return {
      channelId,
      cardId,
      lastTopic: {
        guid,
        sealed: summary.sealed,
        dataType: summary.dataType,
        data: topicData,
        created: summary.created,
        updated: summary.updated,
        status,
        transform,
      },
      unread,
      sealed: channelSealed,
      dataType: detail.dataType,
      data: channelData,
      created: detail.created,
      updated: detail.updated,
      enableImage,
      enableAudio,
      enableVideo,
      enableBinary,
      membership: { pushEnabled },
      members: contacts,
    };
  }
 
  private async init() {
    this.revision = await this.store.getContactRevision(this.guid);

    // load map of cards
    const cards = await this.store.getContacts(this.guid); 
    cards.forEach(({ cardId, item }) => {
      const card = setCard(cardId, item);
      this.cardEntries.set(cardId, { item, card });
    })
 
    // load map of articles
    const articles = await this.store.getContactCardArticles(this.guid);
    articles.forEach(({ cardId, articleId, item }) => {
      if (!this.articleEntries.has(cardId)) {
        this.articleEntries.set(cardId, new Map<string, Map<string, { item: ArticleItem, article: Article }>>);
      }
      const article = setArticle(cardId, articleId, item);
      this.articleEntries.set(cardId).set(articleId, { item, article });
    });

    // load map of channels
    const channels = await this.store.getContactCardChannels(this.guid);
    channels.forEach(({ cardId, channelId, item }) => {
      if (!this.channelEntries.has(cardId)) {
        this.channelEntries.set(cardId, new Map<string, Map<string, { item: ChannelItem, channel: Channel }>>);
      }
      const channel = setChannel(cardId, channelId, item);
      this.channelEntries.set(cardId).set(channelId, { item, channel });
    });

    this.syncing = false;
    await this.sync();
  }

  private getCardEntry(id: string) {
    const entry = this.cardEntries.get(id);
    if (entry) {
      return entry;
    }
    const item = JSON.parse(JSON.stringify(defaultCardItem));
    const card = this.setCard(id, item);
    const cardEntry = { item, card };
    this.cardEntries.set(id, cardEntry);
    return cardEntry;
  }

  private async syncProfile(cardId: string, cardNode: string, cardGuid: string, cardToken: string, revision: number): Promise<void> {
    const { node, secure, token } = this;
    const server = cardNode ? cardNode : node;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
    const message = await getContactProfile(server, !insecure, cardGuid, cardToken);
    await setCardProfile(node, secure, token, cardId, message);
  }

  private async syncArticles(id: string, revision: number): Promise<void> {
  }

  private async syncChannels(id: string, revision: number): Promise<void> {
  }

  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      while (this.nextRevision && !this.closing) {
        if (this.revision !== this.nextRevision) {
          const nextRev = this.nextRevision;
          try {
            const { guid, node, secure, token } = this;
            const delta = await getCards(node, secure, token, this.revision);
            for (const entity of delta) {
              const { id, revision, data } = entity;
              if (data) {
                const entry = this.getCardEntry(id);

                if (data.detailRevision !== entry.item.detail.revison) {
                  const detail = data.cardDetail ? data.cardDetail : await getCardDetail(node, secure, token, id);
                  const { status, statusUpdated, token: cardToken } = detail;
                  entry.item.detail = { revision: data.detailRevision, status, statusUpdated, token: cardToken }
                  entry.card = this.setCard(id, entry.item);                  
                  this.store.setContactCardDetail(guid, id, entry.item.detail);
                }

                if (data.profileRevision !== entry.item.profile.revision) {
                  const profile = data.cardProfile ? data.cardProfile : await getCardProfile(node, secure, token, id);
                  const { guid: profileGuid, handle, name, description, location, imageSet, node: profileNode, seal } = profile;
                  entry.item.profile = { revision: data.profileRevision, handle, guid: profileGuid, name, description, location, imageSet, node: profileNode, seal };
                  entry.card = this.setCard(id, entry.item);                  
                  this.store.setContactCardProfile(guid, id, entry.item.profile);
                }

                if (data.notifiedProfile > entry.item.profile.revision && data.notifiedProfile !== entry.item.profileRevision) {
                  try {
                    await this.syncProfile(id, entry.item.profile.node, entry.item.profile.guid, entry.item.detail.token, entry.item.profileRevision);
                    entry.item.profileRevision = data.notifiedProfile;
                    this.store.setContactCardProfileRevision(guid, id, data.notifiedProfile);
                  }
                  catch (err) {
                    this.log.warn(err);
                    entry.item.offsync = true;
                    this.store.setContactCardOffsync(guid, id, true);
                  }
                }

                if (data.notifiedArticle !== entry.item.articleRevision) {
                  try {
                    await this.syncArticles(id, entry.item.articleRevision);
                    entry.item.articleRevision = data.notifiedArticle;
                    this.store.setContactCardArticlesRevision(guid, id, data.notifiedArticle);
                  }
                  catch (err) {
                    this.log.warn(err);
                    entry.item.offsync = true;
                    this.store.setContactCardOffsync(guid, id, true);
                  }
                  this.emitArticles(id);
                }

                if (data.notifiedChannel !== entry.item.channelRevision) {
                  try {
                    await this.syncChannels(id, entry.item.channelRevision);
                    entry.item.channelRevision = data.notifiedChannel;
                    this.store.setContactCardChannelsRevision(guid, id, data.notifiedChannel);
                  }
                  catch (err) {
                    this.log.warn(err);
                    entry.item.offsync = true;
                    this.store.setContactCardOffsync(guid, id, true);
                  }
                  this.emitChannels(id);
                }
              }
              else {
                this.cardEntries.delete(id);
              }
            }

            this.emitCards();
            await this.store.setContactRevision(guid, nextRev);
            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`card revision: ${nextRev}`);
          }
          catch (err) {
            this.log.warn(err);
            await new Promise(r => setTimeout(r, RETRY_POLL_MS));
          }
        }

        if (this.revision === this.nextRevsion) {
          this.nextRevision = null;
        }
      }
      this.syncing = false;
    }
  }

  public addCardListener(ev: (cards: Card[]) => void): void {
    this.emitter.on('card', ev);
    const cards = Array.from(this.cardEntries, ([cardId, entry]) => (entry.card));
    ev(cards);
  }

  public removeCardListener(ev: (cards: Card[]) => void): void {
    this.emitter.off('card', ev);
  }

  private emitCards() {
    const cards = Array.from(this.cardEntries, ([cardId, entry]) => (entry.card));
    this.emitter.emit('card', cards);
  }

  public addArticleListener(id: string | null, ev: (arg: { cardId: string, articles: Article[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.on(`article::${cardId}`, ev);
      const entries = this.articleEntries.get(cardId);
      const articles = entries ? Array.from(entries, ([articleId, entry]) => (entry.article)) : [];
      ev({ cardId, articles });
    } else {
      this.emitter.on('article', ev);
      this.articleEntries.forEach((entries, cardId) => {
        const articles = Array.from(entries, ([articleId, entry]) => (entry.article));
        ev({ cardId, articles });
      });
    }
  }

  public removeArticleListener(id: string | null, ev: (arg: { cardId: string, articles: Article[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.off(`article::${cardId}`, ev);
    } else {
      this.emitter.off('article', ev);
    }
  }

  private emitArticles(cardId: string) {
    const entries = this.articleEntries.get(cardId);
    const articles = entries ? Array.from(entries, ([articleId, entry]) => (entry.article)) : [];
    this.emitter.emit('article', { cardId, articles });
    this.emitter.emit(`article::${cardId}`, { cardId, articles });
  }

  public addChannelListener(id: string | null, ev: (arg: { cardId: string, channels: Channel[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.on(`channel::${cardId}`, ev);
      const entries = this.channelEntries.get(cardId);
      const channels = entries ? Array.from(entries, ([channelId, entry]) => (entry.channel)) : [];
      ev({ cardId, channels });
    } else {
      this.emitter.on('channel', ev);
      this.channelEntries.forEach((entries, cardId) => {
        const channels = Array.from(entries, ([channelId, entry]) => (entry.channel));
        ev({ cardId, channels });
      });
    }
  }

  public removeChannelListener(id: string | null, ev: (arg: { cardId: string, channels: Channel[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.off(`channel::${cardId}`, ev);
    } else {
      this.emitter.off('channel', ev);
    }
  }

  private emitChannels(cardId: string) {
    const entries = this.channelEntries.get(cardId);
    const channels = entries ? Array.from(entries, ([channelId, entry]) => (entry.channel)) : [];
    this.emitter.emit('channel', { cardId, channels });
    this.emitter.emit(`channel::${cardId}`, { cardId, channels });
  }

  public addTopicRevisionListener(cardId: string, channelId: string, ev: (arg: { cardId: string, channelId: string, revision: number }) => void): void {
    this.emitter.on(`revision::${cardId}::${channelId}`, ev);
    const entries = this.channelEntries.get(cardId);
    const entry = entries ? entries.get(channelId) : null;
    const revision = entry ? entry.revision.topic : 0;
    ev({ cardId, channelId, revision });
  }

  public removeTopicRevisionListener(cardId: string, channelId: string, ev: (arg: { cardId: string, channelId: string, revision: number }) => void): void {
    this.emitter.off(`revision::${cardId}::${channelId}`, ev);
  }

  public emitTopicRevision(cardId: string, channelId: string) {
    const entries = this.channelEntries.get(cardId);
    const entry = entries ? entries.get(channelId) : null;
    const revision = entry ? entry.revision.topic : 0;
    this.emitter.emit(`revision::${cardId}::${channelId}`, revision);
  }

  public async close(): void {
  }

  public async setRevision(rev: number): Promise<void> {
    this.nextRevision = rev;
    await this.sync();
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

  public async setTopicSubject(cardId: string, channelId: string, topicId: string, subject: string): Promise<void> {
  }

  public async setTopicSort(cardId: string, channelId: string, topicId: string, sort: number): Promise<void> {
  }

  public async addTag(cardId: string, channelId: string, topicId: string, type: string, value: string): Promise<string> {
    return '';
  }

  public async removeTag(cardId: string, channelId: string, topicId: string, tagId: string): Promise<void> {
  }

  public async setTagSubject(cardId: string, channelId: string, topicId: string, tagId: string, subject: string): Promise<void> {
  }

  public async setTagSort(cardId: string, channelId: string, topicId: string, tagId: string, sort: number): Promise<void> {
  } 

  public async getTopics(cardId: string, channelId: string): Promise<Topic[]> {
    return [];
  }

  public async getMoreTopics(cardId: string, channelId: string): Promise<Topic[]> {
    return [];
  }

  public async getTags(cardId: string, channelId: string, topicId: string): Promise<Tag[]> {
    return [];
  }

  public async getMoreTags(cardId: string, channelId: string, topicId: string): Promise<Tag[]> {
    return [];
  }

  public async enableChannelNotifications(cardId: string, channelId: string): Promise<void> {
  }

  public async disableChannelNotifications(cardId: string, channelid: string): Promise<void> {
  }

  public async setUnreadChannel(cardId: string, channelId: string): Promise<void> {
  }

  public async clearUnreadChannel(cardId: string, channelId: string): Promise<void> {
  }  

  public async getRegistry(server: string): Promise<Profile[]> {
    return [];
  }

  public getRegistryImageUrl(server: string, guid: string): string {
    return '';
  }

  public getTopicAssetUrl(cardId: string, channelId: string, topicId: string, assetId: string): string {
    return '';
  }

  public getCardImageUrl(cardId: string): string {
    return '';
  }

  public async addParticipantAccess(cardId: string, channelId: string, name: string): Promise<Participant> {
    return { id: '', name: '', node: '', secure: false, token: '' };
  }

  public async removeParticipantAccess(cardId: string, channelId: string, repeaterId: string): Promise<void> {
  }

}

