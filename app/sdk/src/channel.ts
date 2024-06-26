import { type Channel } from './types';

export class ChannelModule implements Channel {
  constructor(token: string, url: string, sync: (flag: boolean) => void) {}
}

