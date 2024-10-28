import type { Contact, Content, Stream } from './api';
import type { Channel } from './types';
import { Logging } from './logging';

export class StreamModule implements Stream {
  private log: Logging;
  private contact: Contact;
  private content: Content;

  constructor(log: Logging, contact: Contact, content: Content) {
    this.contact = contact;
    this.content = content;
    this.log = log;
  }

  public async addChannel(sealed: boolean, type: string, subject: string, cardIds: string[]): Promise<string> {
    return await this.content.addChannel(sealed, type, subject, cardIds);
  }

  public async removeChannel(channelId: string): Promise<void> {
    return await this.content.removeChannel(channelId);
  }

  public async setChannelSubject(channelId: string, subject: string): Promise<void> {
    return await this.content.setChannelSubject(channelId, subject);
  }

  public async setChannelCard(channelId: string, cardId: string): Promise<void> {
    return await this.content.setChannelCard(channelId, cardId);
  }

  public async clearChannelCard(channelId: string, cardId: string): Promise<void> {
    return await this.content.clearChannelCard(channelId, cardId);
  }

  public async leaveChannel(cardId: string, channelId: string): Promise<void> {
    return await this.contact.leaveChannel(cardId, channelId)
  }

  public async getChannelNotifications(cardId: string | null, channelId: string): Promise<boolean> {
    if (cardId) {
      return await this.contact.getChannelNotifications(cardId, channelId);
    }
    return await this.content.getChannelNotifications(channelId)
  }
    
  public async setChannelNotifications(cardId: string | null, channelId: string, enabled: boolean): Promise<void> {
    if (cardId) {
      return await this.contact.setChannelNotifications(cardId, channelId, enabled)
    }
    return await this.content.setChannelNotifications(channelId, enabled);
  }

  public async setUnreadChannel(cardId: string | null, channelId: string, unread: boolean): Promise<void> {
    if (cardId) {
      return await this.contact.setUnreadChannel(cardId, channelId, unread);
    }
    return await this.content.setUnreadChannel(channelId, unread);
  }

  public async flagChannel(cardId: string, channelId: string): Promise<void> {
    if (cardId) {
      return await this.contact.flagChannel(cardId, channelId);
    }
    return await this.content.flagChannel(channelId);
  }

  public async setBlockedChannel(cardId: string | null, channelId: string, blocked: boolean): Promise<void> {
    if (cardId) {
      return await this.contact.setBlockedChannel(cardId, channelId, blocked);
    }
    return await this.content.setBlockedChannel(channelId, blocked);
  }

  public async getBlockedChannels(): Promise<Channel[]> {
    const channels = await this.content.getBlockedChannels();
    const cardChannels = await this.contact.getBlockedChannels();
    return channels.concat(cardChannels);
  }

  public addChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.content.addChannelListener(ev);
    this.contact.addChannelListener(ev);
  }

  public removeChannelListener(ev: (arg: { channels: Channel[], cardId: string | null }) => void): void {
    this.content.removeChannelListener(ev);
    this.contact.removeChannelListener(ev);
  }
}
