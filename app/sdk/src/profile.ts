import { type Profile } from './types';

export class ProfileModule implements Profile {
  constructor(token: string, url: string, sync: (flag: boolean) => void) {}
}

