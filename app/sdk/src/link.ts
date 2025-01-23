import type { Link, Logging } from './api';

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

  public async call(node: string, secure: boolean, token: string, cardId: string, contactNode: string, contactToken: string) {
    const call = await addCall(node, secure, token, cardId);
    this.cleanup = () => { removeCall(node, secure, token, call.id };

    const { id, keepAlive, calleeToken, callerToken, ice } = call;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(contactNode);
    const ring = { index: 0, callId: id, calleeToken, ice };
    await addContactRing(contactNode, !insecure, contactToken, ring);

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
        await addContactRing(contactNode, !insecure, contactToken, ring);
      } catch (err) {
        this.log.error(err);
      }
    }, RING_INTERVAL);

    this.ice = ice;
    connect(callerToken, node, secure);
  }

  public async join(server: string, access: string, ice: { urls: string; username: string; credential: string }[]) {
    this.ice = ice;
    const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
    this.cleanup = () => { removeContactCall(server, !insecure, access); }
    connect(access, server, !insecure);
  }

  private connect(token: string, node: string, secure: boolean) {
    this.websocket = this.setWebSocket(token, node, secure, ice);
    this.staleInterval = setInterval(() => {
      if (this.websocket?.readyState == 1) {
        this.websocket.ping?.(); // not defined in browser
      }
    }, PING_INTERVAL);
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
  }

  public setStatusListener(listener: (status: string) => void) {
    this.statusListener = listener;
    this.notifyStatus(this.status);
  }
  public clearStatusListener() {
    this.statusListener = null;
  }

  public setMessageListener(ev: (message: any) => void) {
    this.messageListener = listener;
  }
  public clearMessageListener() {
    this.messageListener = null;
  }

  public async sendMessage(message: any) {
    if (this.status !== 'connected') {
      log.error('dropping message while not connected')
    } else {
      this.websocket.send(JSON.stringify(message));
    }
  }

  private async notify() {
    if (!this.notifying) {
      this.notifying = true;
      while(this.messages.length > 0 && !this.error && !this.closed) {
        const data = this.messages.shift();
        try {
          const message = JSON.parse(daata);
          if (message.status) {
            await this.notifyStatus(message.status);
          } else {
            await this.notifyMessage(message);
          }
        } catch (err) {
          this.log('failed to process signal message');
          this.notifyStatus('error');
        }
      }
      this.notifying = false;
    }
  }

  private async notifyStatus(status: string) {
    if (status === 'connected' && this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }

    try {
      this.status = status;
      if (this.statusListener) {
        await this.statusListner(status);
      }
    } catch (err) {
      this.log('status notification failed');
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
      this.notifyStatus('connecting');
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
      log.error(e);
      ws.close();
    };
    return ws;
  }
}
