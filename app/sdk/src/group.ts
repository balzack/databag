import { type Group } from './api';

export class GroupModule implements Group {
  constructor(token: string, url: string, sync: (flag: boolean) => void) {}
}

