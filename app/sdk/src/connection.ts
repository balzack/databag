import { EventEmitter } from 'eventemitter3';
import { Logging } from './api';
import { Revision } from './entities';
import { Call } from './types';

const PING_INTERVAL = 5000;

export class Connection {
  private log: Logging;
  private closed: boolean;
  private emitter: EventEmitter;
  private websocket: WebSocket;
  private stale: number;

  constructor(log: Logging, token: string, node: string, secure: boolean) {
    this.closed = false;
    this.log = log;
    this.emitter = new EventEmitter();
    this.websocket = this.setWebSocket(token, node, secure);

    this.stale = setInterval(() => {
      if (this.websocket?.readyState == 1) {
        this.websocket.ping?.(); // not defined in browser
      }
    }, PING_INTERVAL);
  }

  public async close() {
    this.closed = true;
    clearInterval(this.stale);
    if (this.websocket) {
      this.websocket.close();
    }
  }

  public addRevisionListener(ev: (revision: Revision) => void): void {
    this.emitter.on('revision', ev);
  }

  public removeRevisionListener(ev: (revision: Revision) => void): void {
    this.emitter.off('revision', ev);
  }

  public addRingListener(ev: (call: Call) => void): void {
    this.emitter.on('call', ev);
  }

  public removeRingListener(ev: (call: Call) => void): void {
    this.emitter.off('call', ev);
  }

  public addStatusListener(ev: (status: string) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.emitter.off('status', ev);
  }

  private setWebSocket(token: string, node: string, secure: boolean): WebSocket {
    if (this.closed) {
      this.emitter.emit('status', 'closed');
      return this.websocket;
    }

    this.emitter.emit('status', 'connecting');
    const wsUrl = `ws${secure ? 's' : ''}://${node}/status?mode=ring`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (e) => {
      try {
        if (e.data === '') {
          this.close();
        }
        const activity = JSON.parse(e.data);
        this.emitter.emit('status', 'connected');
        if (activity.revision) {
          this.emitter.emit('revision', activity.revision as Revision);
        } else if (activity.ring) {
          const { cardId, callId, calleeToken, ice, iceUrl, iceUsername, icePassword } = activity.ring;
          const call: Call = {
            cardId,
            callId,
            calleeToken,
            ice: ice
              ? ice
              : [
                  {
                    urls: iceUrl,
                    username: iceUsername,
                    credential: icePassword,
                  },
                ],
          };
          this.emitter.emit('call', call);
        } else {
          this.emitter.emit('revision', activity as Revision);
        }
      } catch (err) {
        console.log(err);
        ws.close();
      }
    };
    ws.onclose = (e) => {
      console.log(e);
      this.emitter.emit('status', 'disconnected');
      setTimeout(() => {
        if (ws != null) {
          ws.onmessage = () => {};
          ws.onclose = () => {};
          ws.onopen = () => {};
          ws.onerror = () => {};
          this.websocket = this.setWebSocket(token, node, secure);
        }
      }, 1000);
    };
    ws.onopen = () => {
      ws.send(JSON.stringify({ AppToken: token }));
    };
    ws.onerror = (e) => {
      console.log(e);
      ws.close();
    };
    return ws;
  }
}
