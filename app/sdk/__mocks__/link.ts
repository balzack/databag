import { EventEmitter } from 'eventemitter3';
import { type Link } from '../src/api';

export class MockLinkModule implements Link {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public setStatusListener(ev: (status: string) => Promise<void>): void {
  }

  public clearStatusListener(): void {
  }

  public setMessageListener(ev: (message: any) => Promise<void>): void {
  }

  public clearMessageListener(): void {
  }

  public getIce(): { urls: string; username: string; credential: string }[] {
    return [];
  }

  public async sendMessage(message: any): Promise<void> {
  }

  public async close(): Promise<void> {
  }

}

