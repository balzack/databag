import type { Link, Logging } from './api';
import { addCall } from './net/addCall';
import { removeCall } from './net/removeCall';
import { removeContactCall } from './net/removeContactCall';
import { addContactRing } from './net/addContactRing';
import { keepCall } from './net/keepCall';

const CLOSE_POLL_MS = 1000;
const RETRY_INTERVAL = 1000;
const PING_INTERVAL = 5000;
const RING_INTERVAL = 2000;

export class LinkModule implements Link {
  private log: Logging;
  private status: string;
  private statusListener: (status: string)=>Promise<void> | null;
  private messageListener: (message: any)=>Promise<void> | null;
  private messages: string[];
  private error: boolean;
  private closed: boolean;
  private notifying: boolean;
  private websocket: Websocket | null;
  private staleInterval: number | null;
  private aliveInterval: number | null;
  private ringInterval: number | null;
  private node: string;
  private secure: boolean;
  private token: string;
  private ice: { urls: string; username: string; credential: string }[];
  private cleanup: null | (()=>void);

  constructor(log: Logging) {
    this.log = log;
    this.statusListener = null;
    this.messageListener = null;
    this.messages = [];
    this.status = 'idle';
    this.error = false;
    this.closed = false;
    this.connected = false;
    this.notifying = false;
    this.websocket = null;
    this.staleInterval = null;
    this.aliveInterval = null;
    this.ringInterval = null;
    this.ice = [];
    this.cleanup = null;
  }

  public getIce(): { urls: string; username: string; credential: string }[] {
    return this.ice;
  }

  public async call(node: string, secure: boolean, token: string, cardId: string, contactNode: string, contactSecure: boolean, contactGuid: string, contactToken: string) {
    const call = await addCall(node, secure, token, cardId);
    this.cleanup = async () => {
      try {
        await removeCall(node, secure, token, call.id)
      } catch (err) {
        this.log.error(err);
      }
    }

    const { id, keepAlive, calleeToken, callerToken, ice } = call;
    const ring = { index: 0, callId: id, calleeToken, ice: JSON.parse(JSON.stringify(ice))};
    await addContactRing(contactNode, contactSecure, contactGuid, contactToken, ring);

    this.aliveInterval = setInterval(async () => {
      try {
        await keepCall(node, secure, token, id);
      } catch (err) {
        this.log.error(err);
      }
    }, keepAlive * 1000);

    this.ringInterval = setInterval(async () => {
      try {
        ring.index += 1;
        await addContactRing(contactNode, contactSecure, contactGuid, contactToken, ring);
      } catch (err) {
        this.log.error(err);
      }
    }, RING_INTERVAL);

    this.ice = ice;
    this.websocket = this.setWebSocket(callerToken, node, secure);
  }

  public async join(server: string, secure: boolean, token: string, ice: { urls: string; username: string; credential: string }[], endCall: ()=>Promise<void>) {
    this.ice = ice;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
    this.cleanup = async () => { 
      try { 
        await endCall();
      } catch (err) {
        this.log.error(err);
      }
    }
    this.websocket = this.setWebSocket(token, server, secure);
  }

  public async close() {
    this.closed = true;
    if (this.staleInterval) {
      clearInterval(this.staleInterval);
      this.staleInterval = null;
    }
    if (this.aliveInterval) {
      clearInterval(this.aliveInterval);
      this.aliveInterval = null;
    }
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (this.websocket) {
      this.websocket.close();
    }
    if (this.cleanup) {
      try {
        this.cleanup();
      } catch (err) {
        this.log.error(err);
      }
    }
    while (this.notifying) {
      await new Promise((r) => setTimeout(r, CLOSE_POLL_MS));
    }
  }

  public setStatusListener(listener: (status: string) => Promise<void>) {
    this.statusListener = listener;
    this.messages.push(JSON.stringify({ status: this.status }));
    this.notify();
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
    if (this.status !== 'connected') {
      this.log.error('dropping message while not connected')
    } else {
      this.websocket.send(JSON.stringify(message));
    }
  }

  private async notify() {
    if (!this.notifying && !this.closed) {
      this.notifying = true;
      while(this.messages.length > 0 && !this.error) {
        const data = this.messages.shift();
        try {
          const message = JSON.parse(data);
          if (message.status) {
            await this.notifyStatus(message.status);
          } else {
            await this.notifyMessage(message);
          }
        } catch (err) {
          this.log.error('failed to process signal message');
          this.notifyStatus('error');
        }
      }
      this.notifying = false;
    }
  }

  private async notifyStatus(status: string) {
    try {
      this.status = status;
      if (this.statusListener) {
        await this.statusListener(this.connected && status === 'connected' ? 'reconnected' : status);
      }
    } catch (err) {
      this.log.error('status notification failed');
    }

    if (status === 'connected') {
      this.connected = true;
      if (this.ringInterval) {
        clearInterval(this.ringInterval);
        this.ringInterval = null;
      }
    }
  }

  private async notifyMessage(message: any) {
    try {
      if (this.messageListener) {
        await this.messageListener(message);
      }
    } catch (err) {
      this.log('message notification failed');
    }
  }

  private setWebSocket(token: string, node: string, secure: boolean): WebSocket {
    if (this.closed) {
      return this.websocket;
    }

    const wsUrl = `ws${secure ? 's' : ''}://${node}/signal`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (e) => {
      this.messages.push(e.data);
      this.notify();
    };
    ws.onclose = (e) => {
      this.messages.push(JSON.stringify({ status: 'connecting' }));
      this.notify();
      setTimeout(() => {
        if (ws != null) {
          ws.onmessage = () => {};
          ws.onclose = () => {};
          ws.onopen = () => {};
          ws.onerror = () => {};
          this.websocket = this.setWebSocket(token, node);
        }
      }, RETRY_INTERVAL);
    };
    ws.onopen = () => {
      ws.send(JSON.stringify({ AppToken: token }));
    };
    ws.onerror = (e) => {
      this.log.error(e);
      ws.close();
    };
    return ws;
  }
}
