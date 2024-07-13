import type { Bot, Logging } from './api';
import type { Asset } from './types';

export class BotModule implements Bot {

  private log: Logging;
  private node: string;
  private secure: boolean;
  private token: string;

  constructor(log: Logging, node: string, secure: boolean, token: string) {
    this.log = log;
    this.node = node;
    this.secure = secure;
    this.token = token;
  }

  public async addTopic(type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(topicId: string): Promise<void> {
  }

  public async addTag(topicId: string, type: string, value: string): Promise<string> {
    return '';
  }

  public async removeTag(topicId: string, tagId: string): Promise<void> {
  }
}
