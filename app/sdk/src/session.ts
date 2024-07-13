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

import type { Session, Account, Identity, Contact, Ring, Alias, Attribute, Content, Stream, Focus, Crypto, Logging } from './api';
import { Revision } from './entities';
import { Call } from './types';
import { Store } from './store';

export class SessionModule implements Session {

  private emitter: EventEmitter;
  private store: Store;
  private crypto: Crypto | null;
  private log: Logging;
  private token: string;
  private node: string;
  private secure: boolean;
  private loginTimestamp: number;
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
   
  constructor(store: Store, crypto: Crypto | null, log: Logging, token: string, node: string, secure: boolean, loginTimestamp: number) {

    log.info('new databag session');

    this.store = store;
    this.crypto = crypto;
    this.log = log;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.loginTimestamp = loginTimestamp;
    this.syncRevision = null;
    this.status = 'connecting'
    this.emitter = new EventEmitter();
 
    this.account = new AccountModule(log, this.store, token, node, secure);
    this.identity = new IdentityModule(log, this.store, token, node, secure);
    this.contact = new ContactModule(log, this.store, token, node, secure);
    this.alias = new AliasModule(log, this.account, this.store, token, node, secure);
    this.attribute = new AttributeModule(log, this.account, this.store, token, node, secure);
    this.content = new ContentModule(log, this.account, this.store, token, node, secure);
    this.stream = new StreamModule(log, this.contact, this.content, this.store);
    this.ring = new RingModule(log);
    this.connection = new Connection(log, token, node, secure);

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
        this.log.warn(err);
        this.syncRevision = ev;
        this.emitter.emit('status', this.getStatus());
      }
    }

    const onRing = (ev: Call) => {
      this.ring.ring(ev);
    }

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
 
  public async resync() {
    if (this.syncRevision) {
      try {
        await this.identity.setRevision(this.syncRevision.profile);
        await this.account.setRevision(this.syncRevision.account);
        await this.contact.setRevision(this.syncRevision.card);
        await this.attribute.setRevision(this.syncRevision.article);
        await this.alias.setRevision(this.syncRevision.group);
        await this.content.setRevision(this.syncRevision.channel);
        this.syncRevision = null
        this.emitter.emit('status', this.getStatus());
      }
      catch(err) {
        this.log.warn(err);
      }
    }
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
    return new FocusModule(this.log, this.identity, this.contact, this.content, this.store, cardId, channelId);
  }

  public removeFocus(focus: Focus): void {
    focus.blur();
  }
}
