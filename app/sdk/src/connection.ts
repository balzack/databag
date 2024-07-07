import { EventEmitter } from 'eventemitter3';
import { Revision, Ringing } from './entities';

export class Connection {

  private closed: boolean;
  private emitter: EventEmitter;
  private websocket: WebSocket;

  constructor(token: string, url: string) {
    this.closed = false;
    this.emitter = new EventEmitter();
    this.websocket = this.setWebSocket(token, url);
  }

  public close() {
    this.closed = true;
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

  public addRingListener(ev: (ringing: Ringing) => void): void {
    this.emitter.on('ringing', ev);
  }

  public removeRingListener(ev: (ringing: Ringing) => void): void {
    this.emitter.off('ringing', ev);
  }

  public addStatusListener(ev: (status: string) => void): void {
    this.emitter.on('status', ev);
  }

  public removeStatusListener(ev: (status: string) => void): void {
    this.emitter.off('status', ev);
  }

  private setWebSocket(token: string, url: string): WebSocket {
    if (this.closed) {
      this.emitter.emit('status', 'closed');
      return this.websocket;
    }

    this.emitter.emit('status', 'connecting');
    const wsUrl = `ws${url.split('http')?.[1]}/status?mode=ring`;
    const ws = new WebSocket(url);
    ws.onmessage = (e) => {
      try {
        if (e.data === '') {
          this.close();
        }
        const activity = JSON.parse(e.data);
        this.emitter.emit('status', 'connected');
        if (activity.revision) {
          this.emitter.emit('revision', activity.revision as Revision);
        }
        else if (activity.ring) {
          const { cardId, callId, calleeToken, ice, iceUrl, iceUsername, icePassword } = activity.ring;
          const ringing: Ringing = { cardId, callId, calleeToken, ice: ice ? ice : [{ urls: iceUrl, username: iceUsername, credential: icePassword }] };
          this.emitter.emit('ring', ringing);
        }
        else {
          this.emitter.emit('revision', activity as Revision);
        }
      }
      catch (err) {
        console.log(err);
        ws.close();
      }
    }
    ws.onclose = (e) => {
      console.log(e);
      this.emitter.emit('status', 'disconnected');
      setTimeout(() => {
        if (ws != null) {
          ws.onmessage = () => {}
          ws.onclose = () => {}
          ws.onopen = () => {}
          ws.onerror = () => {}
          this.websocket = this.setWebSocket(token, url);
        }
      }, 1000);
    }
    ws.onopen = () => {
      ws.send(JSON.stringify({ AppToken: token }))
    }
    ws.onerror = (e) => {
      console.log(e)
      ws.close();
    }
    return ws;
  }

}
