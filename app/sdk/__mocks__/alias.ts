import { EventEmitter } from 'eventemitter3';
import type { Alias, Account } from '../src/api';
import type { Group } from '../src/types';

export class MockAliasModule implements Alias {

  public revision: number;
  private emitter: EventEmitter;

  constructor() {
    this.revision = 0;
    this.emitter = new EventEmitter();
  }

  public addGroupListener(ev: (groups: Group[]) => void): void {
    this.emitter.on('group', ev);
  }

  public removeGroupListener(ev: (groups: Group[]) => void): void {
    this.emitter.off('group', ev);
  }

  public close(): void {
  }

  public async setRevision(rev: number): Promise<void> {
    this.revision = rev;
  }

  public async addGroup(sealed: boolean, dataType: string, subject: string, cardIds: string[]): Promise<string> {
    return '';
  }

  public async removeGroup(groupId: string): Promise<void> {
  }

  public async setGroupSubject(groupId: string, subject: string): Promise<void> {
  }

  public async setGroupCard(groupId: string, cardId: string): Promise<void> {
  }

  public async clearGroupCard(groupId: string, cardId: string): Promise<void> {
  }

  public async compare(groupIds: string[], cardIds: string[]): Promise<Map<string, string[]>> {
    return new Map<string, string[]>();
  }
}

