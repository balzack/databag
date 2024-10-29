import type { Content } from './api';
import type { Channel } from './types';
import { ContactModule } from './contact';
import { StreamModule } from './stream';
import { Logging } from './logging';

export class ContentModule implements Content {
  private log: Logging;
  private contact: ContactModule;
  private stream: StreamModule;

  constructor(log: Logging, contact: ContactModule, stream: StreamModule) {
    this.contact = contact;
    this.stream = stream;
    this.log = log;
  }

  public async addChannel(sealed: boolean, type: string, subject: string, cardIds: string[]): Promise<string> {
    return await this.stream.addChannel(sealed, type, subject, cardIds);
  }

  public async removeChannel(channelId: string): Promise<void> {
    return await this.stream.removeChannel(channelId);
  }

  public async setChannelSubject(channelId: string, subject: string): Promise<void> {
    return await this.stream.setChannelSubject(channelId, subject);
  }

  public async setChannelCard(channelId: string, cardId: string): Promise<void> {
    return await this.stream.setChannelCard(channelId, cardId);
  }

  public async clearChannelCard(channelId: string, cardId: string): Promise<void> {
    return await this.stream.clearChannelCard(channelId, cardId);
  }

  public async leaveChannel(cardId: string, channelId: string): Promise<void> {
    return await this.contact.leaveChannel(cardId, channelId)
  }

  public async getChannelNotifications(cardId: string | null, channelId: string): Promise<boolean> {
    if (cardId) {
      return await this.contact.getChannelNotifications(cardId, channelId);
    }
    return await this.stream.getChannelNotifications(channelId)
  }
    
  public async setChannelNotifications(cardId: string | null, channelId: string, enabled: boolean): Promise<void> {
    if (cardId) {
      return await this.contact.setChannelNotifications(cardId, channelId, enabled)
    }
    return await this.stream.setChannelNotifications(channelId, enabled);
  }

  public async setUnreadChannel(cardId: string | null, channelId: string, unread: boolean): Promise<void> {
    if (cardId) {
      return await this.contact.setUnreadChannel(cardId, channelId, unread);
    }
    return await this.stream.setUnreadChannel(channelId, unread);
  }

  public async flagChannel(cardId: string, channelId: string): Promise<void> {
    if (cardId) {
      return await this.contact.flagChannel(cardId, channelId);
    }
    return await this.stream.flagChannel(channelId);
  }

  public async setBlockedChannel(cardId: string | null, channelId: string, blocked: boolean): Promise<void> {
    if (cardId) {
      return await this.contact.setBlockedChannel(cardId, channelId, blocked);
    }
    return await this.stream.setBlockedChannel(channelId, blocked);
  }

  public async getBlockedChannels(): Promise<Channel[]> {
    const channels = await this.stream.getBlockedChannels();
    const cardChannels = await this.contact.getBlockedChannels();
    return channels.concat(cardChannels);
  }

  public addChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.stream.addChannelListener(ev);
    this.contact.addChannelListener(ev);
  }

  public removeChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.stream.removeChannelListener(ev);
    this.contact.removeChannelListener(ev);
  }
}
