import { EventEmitter } from 'events';

import { SqlStore } from './index';
import { WebStore } from './index';

import { type Account, AccountModule } from './account';
import { type Profile, ProfileModule } from './profile';
import { type Contact, ContactModule } from './contact';
import { type Group, GroupModule } from './group';
import { type Attribute, AttributeModule } from './attribute';
import { type Channel, ChannelModule } from './channel';

export interface User {
  getAccount(): Account;
  getProfile(): Profile;
  getContact(): Contact;
  getGroup(): Group;
  getAttribute(): Attribute;
  getChannel(): Channel;
}

export class UserModule implements User {

  private store: SqlStore | WebStore | null;
  private token: string;
  private url: string;

  private account: AccountModule; 
  private profile: ProfileModule;
  private contact: ContactModule;
  private group: GroupModule;
  private attribute: AttributeModule;
  private channel: ChannelModule; 

  constructor(store: SqlStore | WebStore | null, token: string, url: string) {
    this.store = store;
    this.token = token;
    this.url = url;
    this.account = new AccountModule(token, url);
    this.profile = new ProfileModule(token, url);
    this.contact = new ContactModule(token, url);
    this.group = new GroupModule(token, url);
    this.attribute = new AttributeModule(token, url);
    this.channel = new ChannelModule(token, url);
  }

  public getAccount(): Account {
    return this.account;
  }

  public getProfile(): Profile {
    return this.profile;
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

  public getChannel(): Channel {
    return this.channel;
  }
}
