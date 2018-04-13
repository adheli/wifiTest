import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SocketConnectionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocketConnectionProvider {

  constructor(public platform: Platform, public http: HttpClient) {
    console.log('Hello SocketConnectionProvider Provider');
    this.configureSocket(platform);
    this.win = (<any>window);
  }

  win: any;
  msgs: Array<string> = [];
  ipAddress: string = '192.168.4.1';
  errorMsg: string = null;
  tcp: any = null;
  ready: boolean = false;
  ipPort: number = 8002;
  version: string = '2.0.0';
  socketTcpId: number = null;
  data: string = null;

  close() {
    this.tcp.close(this.socketTcpId);
  }

  onError(error): void {
    this.errorMsg = error;
    console.error(this.errorMsg);
  }

  onCreate(info: any): void {
    console.log(`Socket created: ${info}`);
  }

  createSocket() {
    console.log('Creating socket');
    try {
      this.tcp.create({}, createInfo => {
        this.socketTcpId = createInfo.socketId;
        console.log(`Socket created with ID: ${this.socketTcpId}`);

        console.log(`Connecting to:  ${this.ipAddress}:${this.ipPort}`);
        this.tcp.connect(this.socketTcpId, this.ipAddress, this.ipPort, result => {
          console.log(`Socket connected with result: ${result}`);
          if (result != 0) {
            this.onError('Result is not 0, I guess thats bad?');
          }

          this.tcp.setKeepAlive(this.socketTcpId, true, 0, () => {
            console.log('Keep alive success');
          });

        });

        this.tcp.onReceiveError.addListener(e => {
          console.log(`Doh! ${e.socketId} | ${e.resultCode}`);
          this.tcp.close(this.socketTcpId);
          this.onError(e.resultCode);
        });

        this.tcp.onReceive.addListener(info => {
          console.log(`TCP data retrieved`);
          // recived, then close connection
          //this.tcp.close(this.socketTcpId);
          //console.log(`Closed socket on receive`);
          const data = this.arrayBuffer2str(info.data);
          console.log(`TCP data retrieved: ${data}`);
        });
      }, this.fail.bind(this));
    }
    catch (e) {
      this.onError(e);
    }
  }

  arrayBuffer2str(buf): string {
    var str = '';
    var ui8 = new Uint8Array(buf);
    for (var i = 0; i < ui8.length; i++) {
      str = str + String.fromCharCode(ui8[i]);
    }
    return str;
  }

  str2arrayBuffer(str): ArrayBuffer {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }

    return buf;
  }

  fail(e): void {
    this.onError(e);
  }

  login() {
    this.submit('\n1234\n');
  }

  submit(data: string) {
    if (!data) {
      this.onError('No data?');
      return;
    }

    if (!data.endsWith('\n')) {
      this.data += '\n';
    }

    const data2send = this.str2arrayBuffer(data);
    // connection ok, send the packet
    console.log(`Sending packet: ${data}`);
    this.tcp.send(this.socketTcpId, data2send);
    console.log(`Packet sent`);
  }

  clear() {
    this.msgs = [];
    this.errorMsg = null;
  }

  configureSocket(platform: any) {
    platform.ready()
      .then((readySource) => {
        console.log(`Platform ready: ${readySource}`);
        console.log(`Cordova platform is ${platform.is('cordova') ? '' : 'NOT '}supported`);

        if (!this.win.chrome || !this.win.chrome.sockets) {
          console.log(`No window chrome sockets API available`);
        }

        if (readySource == 'cordova') {
          try {
            this.tcp = (<any>window).chrome.sockets.tcp;
            this.ready = true;
            console.log(`Ready: ${this.tcp}`);
            this.createSocket();
          }
          catch (e) {
            this.onError(e);
          }
        } else {
          this.onError('Unsuported platform');
        }
      })
      .catch(this.onError.bind(this));
  }
}
