import { type Contact } from './api';

export class ContactModule implements Contact {
  constructor(token: string, url: string, sync: (flag: boolean) => void) {}
}

