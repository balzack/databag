import { EventEmitter } from 'eventemitter3';

import { AccountModule } from './account';
import { IdentityModule } from './identity';
import { ContactModule } from './contact';
import { AliasModule } from './alias';
import { AttributeModule } from './attribute';
import { ContentModule } from './content';
import { StreamModule } from './stream';
import { FocusModule } from './focus';
import { RingModule } from './ring';

import { Connection } from './connection';

import type { Session, SqlStore, WebStore, Crypto, Account, Identity, Contact, Ring, Alias, Attribute, Content, Stream, Focus } from './api';
import { Revision, Ringing } from './entities';

export class SessionModule implements Session {

  private emitter: EventEmitter;
  private store: SqlStore | WebStore | null;
  private crypto: Crypto | null;
  private token: string;
  private url: string;
  private sync: boolean;
  private account: AccountModule; 
  private identity: IdentityModule;
  private contact: ContactModule;
  private alias: AliasModule;
  private attribute: AttributeModule;
  private content: ContentModule;
  private stream: StreamModule;
  private ring: RingModule;
  private connection: Connection;

  constructor(store: SqlStore | WebStore | null, crypto: Crypto | null, token: string, url: string) {
    this.store = store;
    this.crypto = crypto;
    this.token = token;
    this.url = url;
    this.sync = true;
    this.emitter = new EventEmitter();
    this.account = new AccountModule(token, url, this.setSync);
    this.identity = new IdentityModule(token, url, this.setSync);
    this.contact = new ContactModule(token, url, this.setSync);
    this.alias = new AliasModule(token, url, this.setSync, this.account);
    this.attribute = new AttributeModule(token, url, this.setSync, this.account);
    this.content = new ContentModule(token, url, this.setSync, this.account);
    this.stream = new StreamModule(this.contact, this.content);
    this.ring = new RingModule();
    this.connection = new Connection(token, url);

    this.connection.addStatusListener((ev: string) => {
      this.emitter.emit('status', ev);
    });

    this.connection.addRevisionListener((ev: Revision) => {
      // handle revision
    });

    this.connection.addRingListener((ev: Ringing) => {
      // handle ringing
    });
  }

  public addStatusListener(ev: (status: string) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.emitter.off('status', ev);
  }

  public setSync(sync: boolean) {
    this.sync = sync;
    // update status
  }

  public resync() {
  }

  public close() {
    this.connection.close();
    this.stream.close();
    this.content.close();
    this.attribute.close();
    this.alias.close();
    this.contact.close();
    this.identity.close();
    this.account.close();
  }

  public getAccount(): Account {
    return this.account;
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

  public getStream(): Stream {
    return this.stream;
  }

  public getRing(): Ring {
    return this.ring;
  }

  public addFocus(cardId: string | null, channelId: string): Focus {
    return new FocusModule(this.identity, this.contact, this.content, cardId, channelId);
  }

  public removeFocus(focus: Focus): void {
    focus.blur();
  }
}
