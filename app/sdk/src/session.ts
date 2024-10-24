import { EventEmitter } from "eventemitter3";

import { SettingsModule } from "./settings";
import { IdentityModule } from "./identity";
import { ContactModule } from "./contact";
import { AliasModule } from "./alias";
import { AttributeModule } from "./attribute";
import { ContentModule } from "./content";
import { StreamModule } from "./stream";
import { FocusModule } from "./focus";
import { RingModule } from "./ring";

import { Connection } from "./connection";

import type { Session, Settings, Identity, Contact, Ring, Alias, Attribute, Content, Stream, Focus } from "./api";
import { Revision } from "./entities";
import { Call } from "./types";
import { Store } from "./store";
import type { Logging } from "./logging";
import type { Crypto } from "./crypto";

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

  constructor(store: Store, crypto: Crypto | null, log: Logging, guid: string, token: string, node: string, secure: boolean, loginTimestamp: number, channelTypes: string[], articleTypes: string[]) {
    log.info("new databag session");

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
    this.status = "connecting";
    this.emitter = new EventEmitter();

    this.identity = new IdentityModule(log, this.store, guid, token, node, secure);
    this.settings = new SettingsModule(log, this.store, this.crypto, guid, token, node, secure);
    this.contact = new ContactModule(log, this.store, this.crypto, guid, token, node, secure, channelTypes, articleTypes);
    this.alias = new AliasModule(log, this.settings, this.store, guid, token, node, secure);
    this.attribute = new AttributeModule(log, this.settings, this.store, guid, token, node, secure);
    this.content = new ContentModule(log, this.settings, this.store, this.crypto, guid, token, node, secure);
    this.stream = new StreamModule(log, this.contact, this.content, this.store, guid);
    this.ring = new RingModule(log);
    this.connection = new Connection(log, token, node, secure);

    const onStatus = (ev: string) => {
      this.status = ev;
      this.emitter.emit("status", this.getStatus());
    };

    const onSeal = (seal: { privateKey: string; publicKey: string } | null) => {
      this.contact.setSeal(seal);
    };

    const onRevision = async (ev: Revision) => {
      await this.identity.setRevision(ev.profile);
      await this.settings.setRevision(ev.account);
      await this.contact.setRevision(ev.card);
      await this.attribute.setRevision(ev.article);
      await this.alias.setRevision(ev.group);
      await this.content.setRevision(ev.channel);
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
    this.emitter.on("status", ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.emitter.off("status", ev);
  }

  private getStatus(): string {
    return this.status;
  }

  public getParams(): { node: string; secure: boolean; token: string } {
    const { node, secure, token } = this;
    return { node, secure, token };
  }

  public async close(): Promise<void> {
    await this.content.close();
    await this.attribute.close();
    await this.alias.close();
    await this.contact.close();
    await this.identity.close();
    await this.settings.close();
    await this.stream.close();
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

  public getStream(): Stream {
    return this.stream;
  }

  public getRing(): Ring {
    return this.ring;
  }

  public setFocus(cardId: string | null, channelId: string): Focus {
    if (cardId) {
      return this.contact.setFocus(cardId, channelId);
    }
    return this.content.setFocus(channelId);
  }

  public clearFocus(): void {
    this.contact.clearFocus();
    this.content.clearFocus();
  }
}
