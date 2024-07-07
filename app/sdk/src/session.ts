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
  private syncRevision: Revision | null;
  private status: string;
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
    this.syncRevision = null;
    this.status = 'connecting'
    this.emitter = new EventEmitter();
 
    this.account = new AccountModule(token, url);
    this.identity = new IdentityModule(token, url);
    this.contact = new ContactModule(token, url);
    this.alias = new AliasModule(token, url, this.account);
    this.attribute = new AttributeModule(token, url, this.account);
    this.content = new ContentModule(token, url, this.account);
    this.stream = new StreamModule(this.contact, this.content);
    this.ring = new RingModule();

    const onStatus = (ev: string) => {
      this.status = ev;
      this.emitter.emit('status', this.getStatus());
    }

    const onRevision = async (ev: Revision) => {
      try {
        await this.identity.setRevision(ev.profile);
        await this.account.setRevision(ev.account);
        await this.contact.setRevision(ev.card);
        await this.attribute.setRevision(ev.article);
        await this.alias.setRevision(ev.group);
        await this.content.setRevision(ev.channel);
        if (this.syncRevision) {
          this.syncRevision = null
          this.emitter.emit('status', this.getStatus());
        }
      }
      catch(err) {
        this.syncRevision = ev;
        this.emitter.emit('status', this.getStatus());
      }
    }

    const onRing = (ev: Ringing) => {
    }

    this.connection = new Connection(token, url);
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
    if (this.status === 'connected' && this.syncRevision) {
      return 'offsync';
    }
    return this.status;
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
