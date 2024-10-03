import { EventEmitter } from "eventemitter3";
import type { Alias, Settings, Logging } from "./api";
import type { Group } from "./types";
import { Store } from "./store";

export class AliasModule implements Alias {
  private log: Logging;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private settings: Settings;
  private emitter: EventEmitter;

  constructor(
    log: Logging,
    settings: Settings,
    store: Store,
    guid: string,
    token: string,
    node: string,
    secure: boolean,
  ) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.settings = settings;
    this.emitter = new EventEmitter();
  }

  public addGroupListener(ev: (groups: Group[]) => void): void {
    this.emitter.on("group", ev);
  }

  public removeGroupListener(ev: (groups: Group[]) => void): void {
    this.emitter.off("group", ev);
  }

  public async close(): void {}

  public async setRevision(rev: number): Promise<void> {
    console.log("set alias revision:", rev);
  }

  public async addGroup(
    sealed: boolean,
    dataType: string,
    subject: string,
    cardIds: string[],
  ): Promise<string> {
    return "";
  }

  public async removeGroup(groupId: string): Promise<void> {}

  public async setGroupSubject(
    groupId: string,
    subject: string,
  ): Promise<void> {}

  public async setGroupCard(groupId: string, cardId: string): Promise<void> {}

  public async clearGroupCard(groupId: string, cardId: string): Promise<void> {}

  public async compare(
    groupIds: string[],
    cardIds: string[],
  ): Promise<Map<string, string[]>> {
    return new Map<string, string[]>();
  }
}
