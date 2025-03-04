import type { Contributor } from './api';
import type { Asset } from './types';
import type { Crypto } from './crypto';
import type { Logging } from './logging';

export class ContributorModule implements Contributor {
  private log: Logging;
  private crypto: Crypto | null;
  private node: string;
  private secure: boolean;
  private token: string;

  constructor(log: Logging, crypto: Crypto | null, node: string, secure: boolean, token: string) {
    this.log = log;
    this.crypto = crypto;
    this.node = node;
    this.secure = secure;
    this.token = token;
  }

  public async addTopic(type: string, message: string, assets: Asset[]): Promise<string> {
    return '';
  }

  public async removeTopic(topicId: string): Promise<void> {}

  public async addTag(topicId: string, type: string, value: string): Promise<string> {
    return '';
  }

  public async removeTag(topicId: string, tagId: string): Promise<void> {}
}
