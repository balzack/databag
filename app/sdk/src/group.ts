import { type Group } from './types';

export class GroupModule implements Group {
  constructor(token: string, url: string, sync: (flag: boolean) => void) {}
}

