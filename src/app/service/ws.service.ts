import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  private ws: WebSocket | undefined;
  public data = new Subject<any>();
  public data$ = this.data.asObservable();

  connectWebSocket() {
    this.ws = new WebSocket('ws://localhost:3000/ws');

    this.ws.onopen = () => {
      console.log('Websocket connection opened');
    }

    this.ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
      this.data.next(data);


    }

    this.ws.onclose = () => {
      console.log('Websocket connection closed');
    }
  }
}
