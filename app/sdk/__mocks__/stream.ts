import { EventEmitter } from 'eventemitter3';
import type { Channel, Topic, Asset, Tag, Participant } from '../src/types';

export class MockStreamModule {

  public revision: number;
  private emitter: EventEmitter;

  constructor() {
    this.revision = 0;
    this.emitter = new EventEmitter();
  }

  public close(): void {
  }

  public async setRevision(rev: number): Promise<void> {
    this.revision = rev;
  }
  
  public addChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.emitter.on('channel', ev);
  }

  public removeChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.emitter.off('channel', ev);
  }

  public async setBlockedChannel(channelId: string, blocked: boolean): Promise<void> {
  }

  public async getBlockedChannels(): Promise<Channel[]> {
    return [];
  }

  public async flagChannel(channelId: string): Promise<void> {
  }

  public async getChannelNotifications(channelId: string): Promise<boolean> {
    return false;
  }

  public async setChannelNotifications(channelId: string, enabled: boolean): Promise<void> {
  }

  public async addChannel(sealed: boolean, type: string, subject: string, cardIds: string[]): Promise<string> {
    return '';
  }

  public async removeChannel(channelId: string): Promise<void> {
  }

  public async setChannelSubject(channelId: string, subject: string): Promise<void> {
  }

  public async setChannelCard(channelId: string, cardId: string): Promise<void> {
  }

  public async clearChannelCard(channelId: string, cardId: string): Promise<void> {
  }

  public async setChannelGroup(channelId: string, groupId: string): Promise<void> {
  }

  public async clearChannelGroup(channelId: string, groupId: string): Promise<void> {
  }

  public async setUnreadChannel(channelId: string, unread: boolean): Promise<void> {
  }
}

