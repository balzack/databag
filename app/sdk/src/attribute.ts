import { EventEmitter } from 'events';
import { type Attribute } from './types';

export class AttributeModule implements Attribute {

  private sync: (flag: boolean) => void;
  private token: string;
  private url: string;

  constructor(token: string, url: string, sync: (flag: boolean) => void) {
    this.token = token;
    this.url = url;
    this.sync = sync;
  }

}

