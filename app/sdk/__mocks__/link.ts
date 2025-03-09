import { EventEmitter } from 'eventemitter3';
import { Revision } from '../src/entities';

export class MockLink {
  private statusListener: ((status: string)=>Promise<void>) | null;
  private messageListener: ((message: any)=>Promise<void>) | null;
  private status: string;

  constructor() {
    this.statusListener = null;
    this.messageListener = null;
    this.status = 'idle';
  }

  public getIce(): { urls: string; username: string; credential: string }[] {
    return [];
  }

  public async call(node: string, secure: boolean, token: string, cardId: string, contactNode: string, contactSecure: boolean, contactGuid: string, contactToken: string) {
    return;
  }

  public async join(server: string, secure: boolean, token: string, ice: { urls: string; username: string; credential: string }[], endCall: ()=>Promise<void>) {
    return;
  }

  public async close() {
    return;
  }

  public setStatusListener(listener: (status: string) => Promise<void>) {
    this.statusListener = listener;
    this.statusListener(this.status);
  }
  
  public clearStatusListener() {
    this.statusListener = null;
  }

  public setMessageListener(listener: (message: any) => Promise<void>) {
    this.messageListener = listener;
  }
  
  public clearMessageListener() {
    this.messageListener = null;
  }

  public async sendMessage(message: any) {
  }
}

