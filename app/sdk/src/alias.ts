import { EventEmitter } from 'events';
import { type Alias, type Group } from './api';

export class AliasModule implements Alias {

  private token: string;
  private url: string;
  private sync: (flag: boolean) => void;
  private emitter: EventEmitter;

  constructor(token: string, url: string, sync: (flag: boolean) => void) {
    this.token = token;
    this.url = url;
    this.sync = sync;
    this.emitter = new EventEmitter();
  }

  public addGroupListener(ev: (groups: Group[]) => void): void {
    this.emitter.on('group', ev);
  }

  public removeGroupListener(ev: (groups: Group[]) => void): void {
    this.emitter.off('group', ev);
  }

  public async setRevision(rev: number): Promise<void> {
  }

  public async resync(): Promise<void> {
  }

  public async addGroup(name: string, cardIds: string[]): Promise<string> {
    return '';
  }

  public async removeGroup(groupId: string): Promise<void> {
  }

  public async setGroupName(groupId: string, name: string): Promise<void> {
  }

  public async setGroupCard(groupId: string, cardId: string): Promise<void> {
  }

  public async clearGroupCard(groupId: string, cardId: string): Promise<void> {
  }

  public async compare(groupIds: string[], cardIds: string[]): Promise<Map<string, string[]>> {
    return new Map<string, string[]>();
  }
}

