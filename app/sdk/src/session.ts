import { EventEmitter } from 'events';

import { AccountModule } from './account';
import { IdentityModule } from './identity';
import { ContactModule } from './contact';
import { GroupModule } from './group';
import { AttributeModule } from './attribute';
import { ContentModule } from './content';

import { type Session, type SqlStore, type WebStore, type Account, type Identity, type Contact, type Group, type Attribute, type Content } from './types';

export class SessionModule implements Session {

  private statusEmitter: EventEmitter;
  private store: SqlStore | WebStore | null;
  private token: string;
  private url: string;
  private sync: boolean;

  public account: AccountModule; 
  public identity: IdentityModule;
  public contact: ContactModule;
  public group: GroupModule;
  public attribute: AttributeModule;
  public content: ContentModule; 

  constructor(store: SqlStore | WebStore | null, token: string, url: string) {
    this.store = store;
    this.token = token;
    this.url = url;
    this.sync = true;
    this.statusEmitter = new EventEmitter();
    this.account = new AccountModule(token, url, this.setSync);
    this.identity = new IdentityModule(token, url, this.setSync);
    this.contact = new ContactModule(token, url, this.setSync);
    this.group = new GroupModule(token, url, this.setSync);
    this.attribute = new AttributeModule(token, url, this.setSync);
    this.content = new ContentModule(token, url, this.setSync);
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

  public getGroup(): Group {
    return this.group;
  }

  public getAttribute(): Attribute {
    return this.attribute;
  }

  public getContent(): Content {
    return this.content;
  }
}
