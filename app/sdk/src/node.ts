import { type Node, type NodeAccount, type NodeConfig } from './api';

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
    return { domain: '', accountStorage: '', enableImage: true, enableAudio: true, enableVideo: true, enableBinary: true, keyType: string,
      pushSupported: true, allowUnsealed: true, transformSupported: true, enableIce: true, iceService: '', iceUrl: '', iceUsername: '', 
      enableOpenAcess: true, openAccessLimit: 0 };
  }

  public async setConfig(config: NodeConfig): Promise<void> {
  }

}
