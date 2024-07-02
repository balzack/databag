import { EventEmitter } from 'events';

import { AccountModule } from './account';
import { IdentityModule } from './identity';
import { ContactModule } from './contact';
import { AliasModule } from './alias';
import { AttributeModule } from './attribute';
import { ContentModule } from './content';
import { StreamModule } from './stream';
import { FocusModule } from './focus';

import type { Session, SqlStore, WebStore, Crypto, Account, Identity, Contact, Alias, Attribute, Content, Stream, Focus } from './api';

export class SessionModule implements Session {

  private statusEmitter: EventEmitter;
  private store: SqlStore | WebStore | null;
  private crypto: Crypto | null;
  private token: string;
  private url: string;
  private sync: boolean;

  public account: AccountModule; 
  public identity: IdentityModule;
  public contact: ContactModule;
  public alias: AliasModule;
  public attribute: AttributeModule;
  public content: ContentModule;
  public stream: StreamModule;

  constructor(store: SqlStore | WebStore | null, crypto: Crypto | null, token: string, url: string) {
    this.store = store;
    this.crypto = crypto;
    this.token = token;
    this.url = url;
    this.sync = true;
    this.statusEmitter = new EventEmitter();
    this.account = new AccountModule(token, url, this.setSync);
    this.identity = new IdentityModule(token, url, this.setSync);
    this.contact = new ContactModule(token, url, this.setSync);
    this.alias = new AliasModule(token, url, this.setSync);
    this.attribute = new AttributeModule(token, url, this.setSync, this.account);
    this.content = new ContentModule(token, url, this.setSync, this.account);
    this.stream = new StreamModule(this.contact, this.content);
  }

  public addStatusListener(ev: (status: string) => void): void {
    this.statusEmitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.statusEmitter.off('status', ev);
  }

  public setSync(sync: boolean) {
    this.sync = sync;
    // update status
  }

  public resync() {
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

  public getFocus(cardId: string | null, channelId: string): Focus {
    return new FocusModule(this.identity, this.contact, this.content, cardId, channelId);
  }
}
