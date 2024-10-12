import { EventEmitter } from 'eventemitter3';
import type { Contact, Logging, Focus } from './api';
import type { FocusModule } from './focus';
import type { Card, Topic, Asset, Tag, Profile, Participant } from './types';
import { type CardEntity, avatar } from './entities';
import type {
  ArticleRevision,
  ArticleDetail,
  ChannelRevision,
  ChannelSummary,
  ChannelDetail,
  CardRevision,
  CardNotification,
  CardProfile,
  CardDetail,
} from './items';
import { defaultCardItem, defaultChannelItem } from './items';
import { Store } from './store';
import { Crypto } from './crypto';
import { getCards } from './net/getCards';
import { getCardProfile } from './net/getCardProfile';
import { getCardDetail } from './net/getCardDetail';
import { setCardProfile } from './net/setCardProfile';
import { getContactProfile } from './net/getContactProfile';
import { getContactChannels } from './net/getContactChannels';
import { getContactChannelDetail } from './net/getContactChannelDetail';
import { getContactChannelSummary } from './net/getContactChannelSummary';
import { getCardImageUrl } from './net/getCardImageUrl';
import { addCard } from './net/addCard';
import { getContactListing } from './net/getContactListing';
import { setCardConfirmed } from './net/setCardConfirmed';
import { setCardConnecting } from './net/setCardConnecting';
import { setCardConnected } from './net/setCardConnected';
import { removeContactChannel } from './net/removeContactChannel';
import { getContactChannelNotifications } from './net/getContactChannelNotifications';
import { setContactChannelNotifications } from './net/setContactChannelNotifications';
import { getRegistryImageUrl } from './net/getRegistryImageUrl';
import { getRegistryListing } from './net/getRegistryListing';

const CLOSE_POLL_MS = 100;
const RETRY_POLL_MS = 2000;

export class ContactModule implements Contact {
  private log: Logging;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private emitter: EventEmitter;
  private articleTypes: stirng[];
  private channelTypes: string[];
  private seal: { privateKey: string; publicKey: string } | null;
  private unsealAll: boolean;
  private resync: boolean;
  private focus: FocusModule | null;

  private cryptp: Crypto | null;
  private store: Store;
  private revision: number;
  private nextRevision: number | null;
  private syncing: boolean;
  private closing: boolean;

  // view of cards
  private cardEntries: Map<string, { item: CardItem; card: Card }>;

  // view of articles
  private articleEntries: Map<string, Map<string, { item: ArticleItem; article: Article }>>;

  // view of channels
  private channelEntries: Map<string, Map<string, { item: ChannelItem; channel: Channel }>>;

  constructor(log: Logging, store: Store, crypto: Crypto | null, guid: string, token: string, node: string, secure: boolean, articleTypes, channelTypes) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.store = store;
    this.crypto = crypto;
    this.emitter = new EventEmitter();
    this.articleTypes = articleTypes;
    this.channelTypes = channelTypes;
    this.unsealAll = false;
    this.resync = false;
    this.focus = null;

    this.cardEntries = new Map<string, { item: CardItem; card: Card }>();
    this.articleEntries = new Map<string, Map<string, { item: ArticleItem; article: Article }>>();
    this.channelEntries = new Map<string, Map<string, { item: ChannelItem; channel: Channel }>>();

    this.revision = 0;
    this.sycning = true;
    this.closing = false;
    this.nextRevision = null;
    this.init();
  }

  private async init() {
    const { guid } = this;
    this.revision = await this.store.getContactRevision(guid);

    // load map of cards
    const cards = await this.store.getContacts(guid);
    cards.forEach(({ cardId, item }) => {
      const card = setCard(cardId, item);
      this.cardEntries.set(cardId, { item, card });
    });

    // load map of articles
    const articles = await this.store.getContactCardArticles(guid);
    articles.forEach(({ cardId, articleId, item }) => {
      if (!this.articleEntries.has(cardId)) {
        this.articleEntries.set(cardId, new Map<string, Map<string, { item: ArticleItem; article: Article }>>());
      }
      const article = setArticle(cardId, articleId, item);
      this.articleEntries.set(cardId).set(articleId, { item, article });
    });

    // load map of channels
    const channels = await this.store.getContactCardChannels(guid);
    channels.forEach(({ cardId, channelId, item }) => {
      if (!this.channelEntries.has(cardId)) {
        this.channelEntries.set(cardId, new Map<string, Map<string, { item: ChannelItem; channel: Channel }>>());
      }
      const channel = setChannel(cardId, channelId, item);
      this.channelEntries.set(cardId).set(channelId, { item, channel });
    });

    this.unsealAll = true;
    this.syncing = false;
    await this.sync();
  }

  public async setRevision(rev: number): Promise<void> {
    this.nextRevision = rev;
    await this.sync();
  }

  public async close(): void {
    this.closing = true;
    while (this.syncing) {
      await new Promise((r) => setTimeout(r, CLOSE_POLL_MS));
    }
  }

  public async resyncCard(cardId: string): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      entry.item.resync = true;
    }
    this.resync = true;
    this.sync();
  }

  private async sync(): Promise<void> {
    if (!this.syncing) {
      this.syncing = true;
      const { guid, node, secure, token } = this;
      while ((this.nextRevision || this.resync) && !this.closing) {
        if (this.resync) {
          this.resync = false;
          const entries = Array.from(this.cardEntries, ([key, value]) => ({ key, value }));
          for (const entry of entries) {
            const { key, value } = entry;
            if (item.resync) {
              value.item.resync = false;
              if (value.item.offsyncProfile) {
                try {
                  await this.syncProfile(id, value.item.profile.node, value.item.profile.guid, value.item.detail.token, value.item.profileRevision);
                  value.item.profileRevision = value.item.offsyncProfile;
                  await this.store.setContactCardProfileRevision(guid, value.key, value.item.profileRevision);
                  value.item.offsyncProfile = null;
                  await this.store.clearContactCardOffsyncProfile(guid, value.key);
                  entry.card = this.setCard(id, entry.item);
                  this.emitCards();
                } catch (err) {
                  this.log.warn(err);
                }
              }
              if (entry.item.offsyncArticle) {
                try {
                  await this.syncArticles(id, value.item.profile.node, value.item.profile.guid, value.item.detail.token, value.item.articleRevision);
                  value.item.articleRevision = value.item.offsyncArticle;
                  await this.store.setContactCardArticleRevision(guid, value.key, value.item.articleRevision);
                  value.item.offsyncArticle = null;
                  await this.store.clearContactCardOffsyncArticle(guid, value.key);
                  entry.card = this.setCard(id, entry.item);
                  this.emitCards();
                } catch (err) {
                  this.log.warn(err);
                }
              }
              if (entry.item.offsyncChannel) {
                try {
                  await this.syncChannels(id, { guid: profile.guid, node: profile.node, token: detail.token }, entry.item.channelRevision);
                  value.item.channelRevision = value.item.offsyncChannel;
                  await this.store.setContactCardChannelRevision(guid, value.key, value.item.channelRevision);
                  value.item.offsyncChannel = null;
                  await this.store.clearContactCardOffsyncChannel(guid, value.key);
                  entry.card = this.setCard(id, entry.item);
                  this.emitCards();
                } catch (err) {
                  this.log.warn(err);
                }
              }
            }
          }
        }

        if (this.nextRevision && this.revision !== this.nextRevision) {
          const nextRev = this.nextRevision;
          try {
            const delta = await getCards(node, secure, token, this.revision);
            for (const entity of delta) {
              const { id, revision, data } = entity;
              if (data) {
                const entry = await this.getCardEntry(id);

                if (data.detailRevision !== entry.item.detail.revison) {
                  const detail = data.cardDetail ? data.cardDetail : await getCardDetail(node, secure, token, id);
                  const { status, statusUpdated, token: cardToken } = detail;
                  entry.item.detail = {
                    revision: data.detailRevision,
                    status,
                    statusUpdated,
                    token: cardToken,
                  };
                  entry.card = this.setCard(id, entry.item);
                  await this.store.setContactCardDetail(guid, id, entry.item.detail);
                }

                if (data.profileRevision !== entry.item.profile.revision) {
                  const profile = data.cardProfile ? data.cardProfile : await getCardProfile(node, secure, token, id);
                  entry.item.profile = {
                    revision: data.profileRevision,
                    handle: profile.handle,
                    guid: profile.guid,
                    name: profile.name,
                    description: profile.description,
                    location: profile.location,
                    imageSet: profile.imageSet,
                    node: profile.node,
                    seal: profile.seal,
                  };
                  entry.card = this.setCard(id, entry.item);
                  await this.store.setContactCardProfile(guid, id, entry.item.profile);
                }

                const { profileRevision, articleRevision, channelRevision, offsyncProfile, offsyncChannel, offsyncArticle } = entry.item;

                if (data.notifiedProfile > entry.item.profile.revision && data.notifiedProfile !== profileRevision) {
                  if (offsyncProfile) {
                    entry.item.offsyncProfile = data.notifiedProfile;
                    await this.store.setContactCardOffsyncProfile(guid, id, data.notifiedProfile);
                    entry.card = this.setCard(id, entry.item);
                  } else {
                    try {
                      await this.syncProfile(id, entry.item.profile.node, entry.item.profile.guid, entry.item.detail.token, entry.item.profileRevision);
                      entry.item.profileRevision = data.notifiedProfile;
                      await this.store.setContactCardProfileRevision(guid, id, data.notifiedProfile);
                    } catch (err) {
                      this.log.warn(err);
                      entry.item.offsyncProfile = data.notifiedProfile;
                      await this.store.setContactCardOffsyncProfile(guid, id, data.notifiedProfile);
                      entry.card = this.setCard(id, entry.item);
                    }
                  }
                }

                if (data.notifiedArticle !== articleRevision) {
                  if (offsyncArticle) {
                    entry.item.offsyncArticle = data.notifiedArticle;
                    await this.store.setContactCardOffsyncArticle(guid, id, data.notifiedArticle);
                    entry.card = this.setCard(id, entry.item);
                  } else {
                    try {
                      await this.syncArticles(id, entry.item.profile.node, entry.item.profile.guid, entry.item.detail.token, entry.item.articleRevision);
                      entry.item.articleRevision = data.notifiedArticle;
                      await this.store.setContactCardArticleRevision(guid, id, data.notifiedArticle);
                      this.emitArticles(id);
                    } catch (err) {
                      this.log.warn(err);
                      entry.item.offsyncArticle = data.notifiedArticle;
                      await this.store.setContactCardOffsyncArticle(guid, id, data.notifiedArticle);
                      entry.card = this.setCard(id, entry.item);
                    }
                  }
                }

                if (data.notifiedChannel !== channelRevision) {
                  if (offsyncChannel) {
                    entry.item.offsyncChannel = data.notifiedChannel;
                    await this.store.setContactCardOffsyncChannel(guid, id, data.notifiedChannel);
                    entry.card = this.setCard(id, entry.item);
                  } else {
                    try {
                      const { profile, detail } = entry.item;
                      await this.syncChannels(id, { guid: profile.guid, node: profile.node, token: detail.token }, entry.item.channelRevision);
                      entry.item.channelRevision = data.notifiedChannel;
                      await this.store.setContactCardChannelRevision(guid, id, data.notifiedChannel);
                      this.emitChannels(id);
                    } catch (err) {
                      this.log.warn(err);
                      entry.item.offsyncChannel = data.notifiedChannel;
                      await this.store.setContactCardOffsyncChannel(guid, id, data.notifiedChannel);
                      entry.card = this.setCard(id, entry.item);
                    }
                  }
                }
              } else {
                this.cardEntries.delete(id);
                await this.store.removeContactCard(guid, id);
                this.channelEntries.delete(id);
                this.emitChannels(id);
                this.articleEntries.delete(id);
                this.emitArticles(id);
              }
            }

            this.emitCards();
            await this.store.setContactRevision(guid, nextRev);
            this.revision = nextRev;
            if (this.nextRevision === nextRev) {
              this.nextRevision = null;
            }
            this.log.info(`card revision: ${nextRev}`);
          } catch (err) {
            this.log.warn(err);
            await new Promise((r) => setTimeout(r, RETRY_POLL_MS));
          }
        }

        if (this.revision === this.nextRevision) {
          this.nextRevision = null;
        }
      }

      if (this.unsealAll) {
        for (const card of this.channelEntries.entries()) {
          for (const channel of card.value.entries()) {
            try {
              const { item } = channel.value;
              const cardId = card.key;
              const channelId = channel.key;
              if (await this.unsealChannelDetail(cardId, channelId, item)) {
                await this.store.setContactCardChannelUnsealedDetail(guid, cardId, channelId, item.unsealedDetail);
              }
              if (await this.unsealChannelSummary(cardId, channelId, item)) {
                await this.store.setContactCardChannelUnsealedSummary(guid, cardId, channelId, item.unsealedSummary);
              }
              const channel = setChannel(cardId, channelId, item);
              this.channelEntries.set(cardId).set(channelId, { item, channel });
            } catch (err) {
              this.log.warn(err);
            }
          }
        }
        this.unsealAll = false;
      }

      this.syncing = false;
    }
  }

  private async syncProfile(cardId: string, cardNode: string, cardGuid: string, cardToken: string, revision: number): Promise<void> {
    const { node, secure, token } = this;
    const server = cardNode ? cardNode : node;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
    const message = await getContactProfile(server, !insecure, cardGuid, cardToken);
    await setCardProfile(node, secure, token, cardId, message);
  }

  private async syncArticles(cardId: string, cardNode: string, cardGuid: string, cardToken: string, revision: number): Promise<void> {
    const { node, secure, token } = this;
    const server = cardNode ? cardNode : node;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  }

  private async syncChannels(cardId: string, card: { guid; node; token }, revision: number): Promise<void> {
    const { guid, node, secure, token, channelTypes } = this;
    const server = card.node ? card.node : node;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
    const delta = await getContactChannels(server, !insecure, card.guid, card.token, revision, channelTypes);

    for (const entity of delta) {
      const { id, revision, data } = entity;
      if (data) {
        const { detailRevision, topicRevision, channelSummary, channelDetail } = data;
        const entries = this.getChannelEntries(cardId);
        const entry = await this.getChannelEntry(entries, cardId, id);

        if (detailRevision !== entry.item.detail.revision) {
          const detail = channelDetail ? channelDetail : await getContactChannelDetail(server, !insecure, id);
          entry.item.detail = {
            revision: detailRevision,
            sealed: detail.dataType === 'sealed',
            dataType: detail.dataType,
            data: detail.data,
            created: detail.created,
            updated: detail.updated,
            enableImage: detail.enableImage,
            enableAudio: detail.enableAudio,
            enableVideo: detail.enableVideo,
            enableBinary: detail.enableBinary,
            contacts: detail.contacts,
            members: detail.members,
          };
          entry.item.unsealedDetail = null;
          await this.unsealChannelDetail(cardId, id, entry.item);
          entry.channel = this.setChannel(cardId, id, entry.item);
          await this.store.setContactCardChannelDetail(guid, cardId, id, entry.item.detail, entry.item.unsealedDetail);
        }

        if (topicRevision !== entry.item.summary.revision) {
          const summary = channelSummary ? channelSummary : await getContactChannelSummary(server, !insecure, id);
          entry.item.summary = {
            revision: topicRevision,
            guid: summary.lastTopic.guid,
            dataType: summary.lastTopic.dataType,
            data: summary.lastTopic.data,
            created: summary.lastTopic.created,
            updated: summary.lastTopic.updated,
            status: summary.lastTopic.status,
            transform: summary.lastTopic.transform,
          };
          entry.item.unsealedSummary = null;
          await this.unsealChannelSummary(cardId, id, entry.item);
          entry.channel = this.setChannel(cardId, id, entry.item);
          await this.store.setContactCardChannelSummary(guid, cardId, id, entry.item.summary, entry.item.unsealedSummary);
        }

        await this.store.setContactCardChannelTopicRemoteRevision(guid, cardId, id, topicRevision);
        if (this.focus) {
          await this.focus.setRevision(cardId, id, card, topicRevision);
        }
      } else {
        const channels = this.getChannelEntries(cardId);
        channels.delete(id);
        await this.store.removeContactCardChannel(guid, cardId, id);
        if (this.focus) {
          await this.focus.disconnect(chardId, id);
        }
      }
    }
  }



  public addCardListener(ev: (cards: Card[]) => void): void {
    this.emitter.on('card', ev);
    const cards = Array.from(this.cardEntries, ([cardId, entry]) => entry.card);
    ev(cards);
  }

  public removeCardListener(ev: (cards: Card[]) => void): void {
    this.emitter.off('card', ev);
  }

  private emitCards() {
    const cards = Array.from(this.cardEntries, ([cardId, entry]) => entry.card);
    this.emitter.emit('card', cards);
  }

  public addArticleListener(id: string | null, ev: (arg: { cardId: string; articles: Article[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.on(`article::${cardId}`, ev);
      const entries = this.articleEntries.get(cardId);
      const articles = entries ? Array.from(entries, ([articleId, entry]) => entry.article) : [];
      ev({ cardId, articles });
    } else {
      this.emitter.on('article', ev);
      this.articleEntries.forEach((entries, cardId) => {
        const articles = Array.from(entries, ([articleId, entry]) => entry.article);
        ev({ cardId, articles });
      });
    }
  }

  public removeArticleListener(id: string | null, ev: (arg: { cardId: string; articles: Article[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.off(`article::${cardId}`, ev);
    } else {
      this.emitter.off('article', ev);
    }
  }

  private emitArticles(cardId: string) {
    const entries = this.articleEntries.get(cardId);
    const articles = entries ? Array.from(entries, ([articleId, entry]) => entry.article) : [];
    this.emitter.emit('article', { cardId, articles });
    this.emitter.emit(`article::${cardId}`, { cardId, articles });
  }

  public addChannelListener(id: string | null, ev: (arg: { cardId: string; channels: Channel[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.on(`channel::${cardId}`, ev);
      const entries = this.channelEntries.get(cardId);
      const channels = entries ? Array.from(entries, ([channelId, entry]) => entry.channel) : [];
      ev({ cardId, channels });
    } else {
      this.emitter.on('channel', ev);
      this.channelEntries.forEach((entries, cardId) => {
        const channels = Array.from(entries, ([channelId, entry]) => entry.channel);
        ev({ cardId, channels });
      });
    }
  }

  public removeChannelListener(id: string | null, ev: (arg: { cardId: string; channels: Channel[] }) => void): void {
    if (id) {
      const cardId = id as string;
      this.emitter.off(`channel::${cardId}`, ev);
    } else {
      this.emitter.off('channel', ev);
    }
  }

  private emitChannels(cardId: string) {
    const entries = this.channelEntries.get(cardId);
    const channels = entries ? Array.from(entries, ([channelId, entry]) => entry.channel) : [];
    this.emitter.emit('channel', { cardId, channels });
    this.emitter.emit(`channel::${cardId}`, { cardId, channels });
  }



  public async setFocus(cardId: string, channelId: string): Focus {
    if (this.focus) {
      await this.focus.close();
    }
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const node = entry.item.profile.node;
      const token = entry.item.detail.token;
      this.focus = new FocusModule(this.log, this.store, this.crypto, cardId, channelId, { node, token });
    } else {
      this.focus = new FocusModule(this.log, this.store, this.crypto, cardId, channelId, null);
    }
    return this.focus;
  }

  public async clearFocus() {
    if (this.focus) {
      await this.focus.close();
    }
  }



  public async addCard(server: string, guid: string): Promise<string> {
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
    const message = await getContactListing(server, !insecure, guid);
    const { node, secure, token } = this;
    return await addCard(node, secure, token, message);
  }

  public async removeCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    await removeCard(node, secure, token, cardId);
  }

  public async confirmCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    await setCardConfirmed(node, secure, token, cardId);
  }

  public async connectCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    await setCardConnecting(node, secure, token, cardId);
    try {
      const message = await getCardOpenMessage(node, secure, token, cardId);

      const entry = this.cardEntries.get(cardId);
      if (entry) {
        const server = entry.item.profile.node ? entry.item.profile.node : node;
        const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
        const contact = await setCardOpenMessage(server, !insecure, message);
        if (contact.status === 'connected') {
          const { token, articleRevision, channelRevision, profileRevision } = contact;
          await setCardConnected(node, secure, token, cardId, token, articleRevision, channelRevision, profileRevision);
        }
      }
    } catch (err) {
      this.log.error('failed to deliver open message');
    }
  }

  public async disconnectCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    await setCardConfirmed(node, secure, token, cardId);
    try {
      const message = await getCardCloseMessage(node, secure, token, cardId);
      const entry = this.cardEntries.get(cardId);
      if (entry) {
        const server = entry.item.profile.node ? entry.item.profile.node : node;
        const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
        await setCardCloseMessage(server, !insecure, message);
      }
    } catch (err) {
      this.log.warn('failed to deliver close message');
    }
  }

  public async denyCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      try {
        const message = await getCardCloseMessage(node, secure, token, cardId);
        const server = entry.item.profile.node ? entry.item.profile.node : node;
        const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
        await setCardCloseMessage(server, !insecure, message);
      } catch (err) {
        this.log.warn('failed to deliver close message');
      }
      if (entry.item.detail.status === 'pending') {
        await removeCard(node, secure, token, cardId);
      } else {
        await setCardConfirmed(node, secure, token, cardId);
      }
    }
  }

  public async ignoreCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      if (entry.item.detail.status === 'pending') {
        await removeCard(node, secure, token, cardId);
      } else {
        await setCardConfirmed(node, secure, token, cardId);
      }
    }
  }

  public async cancelCard(cardId: string): Promise<void> {
    const { node, secure, token } = this;
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      if (entry.item.detail.status === 'requesting') {
        try {
          const message = await getCardCloseMessage(node, secure, token, cardId);
          const server = entry.item.profile.node ? entry.item.profile.node : node;
          const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
          await setCardCloseMessage(server, !insecure, message);
        } catch (err) {
          this.log.warn('failed to deliver close message');
        }
        await setCardConfirmed(node, secure, token, cardId);
      }
    }
  }



  public async removeArticle(cardId: string, articleId: string): Promise<void> {}

  public async removeChannel(cardId: string, channelId: string): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const server = entry.item.profile.node ? entry.item.profile.node : this.node;
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
      await removeContactChannel(server, !insecure, entry.item.profile.guid, entry.item.detail.token, channelId);
    }
  }



  public async getBlockedCards(): Promise<Card[]> {
    return Array.from(this.cardEntries.values())
      .filter((entry) => entry.item.blocked)
      .map((entry) => entry.card);
  }

  public async getBlockedChannels(): Promise<Channel[]> {
    const channels: Channel[] = [];
    this.channelEntries.forEach((card) => {
      const cardChannels = Array.from(card.values())
        .filter((channel) => channel.item.blocked)
        .map((entry) => entry.channel);
      channels.push([...cardChannels]);
    });
    return channels;
  }

  public async getBlockedArticles(): Promise<Article[]> {
    const channels: Channel[] = [];
    this.channelEntries.forEach((card) => {
      const cardChannels = Array.from(card.values())
        .filter((channel) => channel.item.blocked)
        .map((entry) => entry.channel);
      channels.push([...cardChannels]);
    });
    return channels;
  }

  public async setBlockedCard(cardId: string, boolean: blocked): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      entry.item.blocked = blocked;
      entry.item.card = this.setCard(cardId, entry.item);
      await this.store.setContactCardBlocked(this.guid, cardId, blocked);
      this.emitCards();
    }
  }

  public async setBlockedArticle(cardId: string, articleId: string, boolean: blocked): Promise<void> {
    const entries = this.articleEntries.get(cardId);
    if (entries) {
      const entry = entries.get(articleId);
      if (entry) {
        entry.item.blocked = blocked;
        entry.item.article = this.setArticle(cardId, articleId, entry.item);
        await this.store.setContactCardArticleBlocked(this.guid, cardId, articleId, blocked);
        this.emitArticles(cardId);
      }
    }
  }

  public async setBlockedChannel(cardId: string, channelId: string, boolean: blocked): Promise<void> {
    const entries = this.channelEntries.get(cardId);
    if (entries) {
      const entry = entries.get(channelId);
      if (entry) {
        entry.item.blocked = blocked;
        entry.item.channel = this.setChannel(cardId, channelId, entry.item);
        await this.store.setContactCardChannelBlocked(this.guid, cardId, channelId, blocked);
        this.emitChannels(cardId);
      }
    }
  }



  public async flagCard(cardId: string): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const server = entry.item.profile.node ? entry.item.profile.node : this.node;
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
      await addFlag(server, !insecure, entry.item.profile.guid, {});
    }
  }

  public async flagArticle(cardId: string, articleId: string): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const server = entry.item.profile.node ? entry.item.profile.node : this.node;
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
      await addFlag(server, !insecure, entry.item.profile.guid, { article: articleId });
    }
  }

  public async flagChannel(cardId: string, channelId: string): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const server = entry.item.profile.node ? entry.item.profile.node : this.node;
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
      await addFlag(server, !insecure, entry.item.profile.guid, { channel: channelId });
    }
  }



  public async setUnreadChannel(cardId: string, channelId: string, unread: boolean): Promise<void> {
    const entries = this.channelEntries.get(cardId);
    if (entries) {
      const entry = entries.get(channelId);
      if (entry) {
        entry.item.unread = unread;
        entry.item.channel = this.setChannel(cardId, channelId, entry.item);
        await this.store.setContactCardChannelUnread(this.guid, cardId, channelId, unread);
        this.emitChannels(cardId);
      }
    }
  }



  public async getChannelNotifications(cardId: string, channelId: string): Promise<boolean> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const server = entry.item.profile.node ? entry.item.profile.node : this.node;
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
      return await getConcatChannelNotifications(server, !insecure, entry.item.profile.guid, entry.item.detail.token, channelId);
    }
    return false;
  }

  public async setChannelNotifications(cardId: string, channelId: string, enabled: boolean): Promise<void> {
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      const server = entry.item.profile.node ? entry.item.profile.node : this.node;
      const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
      await setConcatChannelNotifications(server, !insecure, entry.item.profile.guid, entry.item.detail.token, channelId, enabled);
    }
  }




  public async getRegistry(server: string, secure: boolean): Promise<Profile[]> {
    const listing = await getRegistryListing(server, secure);
    return listing.map((entity) => {
      return {
        guid: entity.guid,
        handle: entity.handle,
        name: entity.name,
        description: entity.description,
        location: entity.location,
        node: entity.node,
        version: entity.version,
        sealSet: Boolean(seal),
        imageSet: Boolean(image),
      };
    });
  }

  public getRegistryImageUrl(server: string, secure: boolean, guid: string): string {
    return getRegistryImageUrl(server, secure, guid);
  }

  public getCardImageUrl(cardId: string): string {
    const entry = this.cardEntries.get(cardId);
    if (entry && entry.item.profile.imageSet) {
      const { node, secure, token } = this;
      return getCardImageUrl(node, secure, token, cardId, entry.item.profile.revision);
    }
    return avatar;
  }



  private setCard(cardId: string, item: CardItem): Card {
    const { node, secure, token } = this;
    const { profile, detail } = item;
    return {
      cardId,
      offsync: Boolean(item.offsyncProfile || item.offsyncChannel || item.offsyncArticle),
      blocked: item.blocked,
      status: detail.status,
      statusUpdated: detail.statusUpdated,
      guid: profile.guid,
      handle: profile.handle,
      name: profile.name,
      description: profile.description,
      location: profile.location,
      imageUrl: profile.imageSet ? getCardImageUrl(node, secure, token, cardId, item.profile.revision) : avatar,
      imageSet: profile.imageSet,
      node: profile.node
    };
  }

  private setArticle(cardId: string, articleId: string, item: ArticleItem): Article {
    const { detail } = item;
    const articleData = detail.sealed ? item.unsealedDetail : detail.data;
    return {
      cardId,
      articleId,
      sealed: detail.sealed,
      blocked: item.blocked,
      dataType: detail.dataType,
      articleData,
      created: detail.created,
      updated: detail.updated,
    };
  }

  private setChannel(cardId: string, channelId: string, item: ChannelItem): Channel {
    const { summary, detail } = item;
    const channelData = detail.sealed ? item.unsealedDetail : detail.data;
    const topicData = summary.sealed ? item.unsealedSummary : summary.data;

    return {
      channelId,
      cardId,
      lastTopic: {
        guid: summary.guid,
        sealed: summary.sealed,
        dataType: summary.dataType,
        data: topicData,
        created: summary.created,
        updated: summary.updated,
        status: summary.status,
        transform: summary.transform,
      },
      blocked: item.blocked,
      unread: item.unread,
      sealed: detail.sealed,
      dataType: detail.dataType,
      data: channelData,
      created: detail.created,
      updated: detail.updated,
      enableImage: detail.enableImage,
      enableAudio: detail.enableAudio,
      enableVideo: detail.enableVideo,
      enableBinary: detail.enableBinary,
      members: detail.members,
    };
  }



  public async setSeal(seal: { privateKey: string; publicKey: string } | null) {
    this.seal = seal;
    this.unsealAll = true;
    await this.sync();
  }

  private async getChannelKey(seals: [{ publicKey: string; sealedKey: string }]): Promise<string | null> {
    const seal = seals.find(({ publicKey }) => publicKey === this.seal.publicKey);
    if (seal) {
      const key = await this.crypto.rsaDecrypt(seal.sealedKey, this.seal.privateKey);
      return key.data;
    }
    return null;
  }

  private async unsealChannelDetail(cardId: string, channelId: string, item: ChannelItem): Promise<boolean> {
    if (item.unsealedDetail == null && item.detail.dataType === 'sealed' && this.seal && this.crypto) {
      try {
        const { subjectEncrypted, subjectIv, seals } = JSON.parse(item.detail.data);
        if (!item.channelKey) {
          item.channelKey = await this.getChannelKey(seals);
        }
        if (item.channelKey) {
          const { data } = await this.crypto.aesDecrypt(subjectEncrypted, subjectIv, item.channelKey);
          const { subject } = JSON.parse(data);
          item.unsealedDetail = subject;
          return true;
        }
      } catch (err) {
        this.log.warn(err);
      }
    }
    return false;
  }

  private async unsealChannelSummary(cardId: string, channelId: string, item: ChannelItem): Promise<boolean> {
    if (item.unsealedSummary == null && item.summary.dataType === 'sealedtopic' && this.seal && this.crypto) {
      try {
        if (!item.channelKey) {
          const { seals } = JSON.parse(item.detail.data);
          item.channelKey = await this.getChannelKey(seals);
        }
        if (item.channelKey) {
          const { messageEncrypted, messageIv } = JSON.parse(item.summary.data);
          const { data } = await this.crypto.aesDecrypt(messageEncrypted, messageIv, item.channelKey);
          const { message } = JSON.parse(data);
          item.unsealedSummary = message;
          return true;
        }
      } catch (err) {
        this.log.warn(err);
      }
    }
    return false;
  }



  private async getCardEntry(cardId: string) {
    const { guid } = this;
    const entry = this.cardEntries.get(cardId);
    if (entry) {
      return entry;
    }
    const item = JSON.parse(JSON.stringify(defaultCardItem));
    const card = this.setCard(cardId, item);
    const cardEntry = { item, card };
    this.cardEntries.set(cardId, cardEntry);
    await this.store.addContactCard(guid, cardId, item);
    return cardEntry;
  }

  private getChannelEntries(cardId: string) {
    const entries = this.channelEntries.get(cardId);
    if (entries) {
      return entries;
    }
    const channels = new Map<string, { item: ChannelItem; channel: Channel }>();
    this.channelEntries.set(cardId, channels);
    return channels;
  }

  private async getChannelEntry(channels: Map<string, { item: ChannelItem; channel: Channel }>, cardId: string, channelId: string) {
    const { guid } = this;
    const entry = channels.get(channelId);
    if (entry) {
      return entry;
    }
    const item = JSON.parse(JSON.stringify(defaultChannelItem));
    const channel = this.setChannel(cardId, channelId, item);
    const channelEntry = { item, channel };
    channels.set(channelId, channelEntry);
    await this.store.addContactCardChannel(guid, cardId, channelId, item);
    return channelEntry;
  }
}
