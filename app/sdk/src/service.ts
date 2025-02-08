import type { Service } from './api';
import type { Member, Setup } from './types';
import type { Logging } from './logging';

export class ServiceModule implements Service {
  private log: Logging;
  private token: string;
  private node: string;
  private secure: boolean;

  constructor(log: Logging, node: string, secure: boolean, token: string) {
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
  }

  public async createMemberAccess(): Promise<string> {
    return '';
  }

  public async resetMemberAccess(): Promise<string> {
    return '';
  }

  public async blockMember(flag: boolean): Promise<void> {}

  public async removeMember(accountId: number): Promise<void> {}

  public async getMembers(): Promise<Member[]> {
    return [];
  }

  public async getSetup(): Promise<Setup> {
    return {
      domain: '',
      accountStorage: '',
      enableImage: true,
      enableAudio: true,
      enableVideo: true,
      enableBinary: true,
      keyType: '',
      pushSupported: true,
      allowUnsealed: true,
      transformSupported: true,
      enableIce: true,
      iceService: '',
      iceUrl: '',
      iceUsername: '',
      icePassword: '',
      enableOpenAccess: true,
      openAccessLimit: 0,
    };
  }

  public async setSetup(config: Setup): Promise<void> {}
}
