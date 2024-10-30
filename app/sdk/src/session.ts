import { EventEmitter } from 'eventemitter3';

import { SettingsModule } from './settings';
import { IdentityModule } from './identity';
import { ContactModule } from './contact';
import { AliasModule } from './alias';
import { AttributeModule } from './attribute';
import { ContentModule } from './content';
import { StreamModule } from './stream';
import { FocusModule } from './focus';
import { RingModule } from './ring';

import { Connection } from './connection';

import type { Session, Settings, Identity, Contact, Ring, Alias, Attribute, Content, Focus } from './api';
import { Revision } from './entities';
import { Call } from './types';
import { Store } from './store';
import type { Logging } from './logging';
import type { Crypto } from './crypto';

export class SessionModule implements Session {
  private emitter: EventEmitter;
  private store: Store;
  private crypto: Crypto | null;
  private log: Logging;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private loginTimestamp: number;
  private status: string;
  private settings: SettingsModule;
  private identity: IdentityModule;
  private contact: ContactModule;
  private alias: AliasModule;
  private attribute: AttributeModule;
  private content: ContentModule;
  private stream: StreamModule;
  private ring: RingModule;
  private connection: Connection;
  private channelTypes: string[];
  private articleTypes: string[];

  constructor(store: Store, crypto: Crypto | null, log: Logging, guid: string, token: string, node: string, secure: boolean, loginTimestamp: number, articleTypes: string[], channelTypes: string[]) {
    log.info('new databag session');

    this.store = store;
    this.crypto = crypto;
    this.log = log;
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.channelTypes = channelTypes;
    this.articleTypes = articleTypes;
    this.loginTimestamp = loginTimestamp;
    this.status = 'connecting';
    this.emitter = new EventEmitter();


console.log(">>> ", channelTypes);

    this.identity = new IdentityModule(log, this.store, guid, token, node, secure);
    this.settings = new SettingsModule(log, this.store, this.crypto, guid, token, node, secure);
    this.contact = new ContactModule(log, this.store, this.crypto, guid, token, node, secure, channelTypes, articleTypes);
    this.alias = new AliasModule(log, this.settings, this.store, guid, token, node, secure);
    this.attribute = new AttributeModule(log, this.settings, this.store, guid, token, node, secure);
    this.stream = new StreamModule(log, this.store, this.crypto, guid, token, node, secure, channelTypes);
    this.content = new ContentModule(log, this.contact, this.stream);
    this.ring = new RingModule(log);
    this.connection = new Connection(log, token, node, secure);

    const onStatus = (ev: string) => {
      this.status = ev;
      this.emitter.emit('status', this.getStatus());
    };

    const onSeal = (seal: { privateKey: string; publicKey: string } | null) => {
      this.contact.setSeal(seal);
      this.stream.setSeal(seal);
    };

    const onRevision = async (ev: Revision) => {
      await this.identity.setRevision(ev.profile);
      await this.settings.setRevision(ev.account);
      await this.contact.setRevision(ev.card);
      await this.attribute.setRevision(ev.article);
      await this.alias.setRevision(ev.group);
      await this.stream.setRevision(ev.channel);
    };

    const onRing = (ev: Call) => {
      this.ring.ring(ev);
    };

    this.settings.addSealListener(onSeal);
    this.connection.addStatusListener(onStatus);
    this.connection.addRevisionListener(onRevision);
    this.connection.addRingListener(onRing);
  }

  public addStatusListener(ev: (status: string) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.emitter.off('status', ev);
  }

  private getStatus(): string {
    return this.status;
  }

  public getParams(): { node: string; secure: boolean; token: string } {
    const { node, secure, token } = this;
    return { node, secure, token };
  }

  public async close(): Promise<void> {
    await this.stream.close();
    await this.attribute.close();
    await this.alias.close();
    await this.contact.close();
    await this.identity.close();
    await this.settings.close();
    this.connection.close();
  }

  public getSettings(): Settings {
    return this.settings;
  }

  public getIdentity(): Identity {
    return this.identity;
  }

  public getContact(): Contact {
    return this.contact;
  }

  public getAlias(): Alias {
    return this.alias;
  }

  public getAttribute(): Attribute {
    return this.attribute;
  }

  public getContent(): Content {
    return this.content;
  }

  public getRing(): Ring {
    return this.ring;
  }

  public async setFocus(cardId: string | null, channelId: string): Promise<Focus> {
    if (cardId) {
      return await this.contact.setFocus(cardId, channelId);
    }
    return await this.stream.setFocus(channelId);
  }

  public async clearFocus(): Promise<void> {
    await this.contact.clearFocus();
    await this.stream.clearFocus();
  }
}
