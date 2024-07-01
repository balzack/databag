import { type Bot } from './api';
import type { Asset } from './types';

export class BotModule implements Bot {

  constructor() {
  }

  public async addTopic(server: string, token: string, type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(server: string, token: string, topicId: string): Promise<void> {
  }

  public async addTag(server: string, token: string, topicId: string, type: string, value: string): Promise<string> {
    return '';
  }

  public async removeTag(server: string, token: string, topicId: string, tagId: string): Promise<void> {
  }
}
