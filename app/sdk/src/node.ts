import { type Node } from './api';
import type { NodeAccount, NodeConfig } from './types';

export class NodeModule implements Node {

  private token: string;
  private url: string;

  constructor(token: string, url: string) {
    this.token = token;
    this.url = url;
  }

  public async createAccountAccess(): Promise<string> {
    return '';
  }

  public async resetAccountAccess(): Promise<string> {
    return '';
  }

  public async blockAccount(flag: boolean): Promise<void> {
  }

  public async removeAccount(accountId: number): Promise<void> {
  }

  public async getAccounts(): Promise<NodeAccount[]> {
    return [];
  }

  public async getConfig(): Promise<NodeConfig> {
    return { domain: '', accountStorage: '', enableImage: true, enableAudio: true, enableVideo: true, enableBinary: true, keyType: '',
      pushSupported: true, allowUnsealed: true, transformSupported: true, enableIce: true, iceService: '', iceUrl: '', iceUsername: '', 
      icePassword: '', enableOpenAccess: true, openAccessLimit: 0 };
  }

  public async setConfig(config: NodeConfig): Promise<void> {
  }

}
