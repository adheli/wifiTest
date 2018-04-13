import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ConnectionProvider } from './../../providers/connection/connection';
import { SocketConnectionProvider } from './../../providers/socket-connection/socket-connection';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: any;

  constructor(public navCtrl: NavController,
    private connectionProvider: ConnectionProvider,
    private socketProvider: SocketConnectionProvider) {
  }

  connectWifi() {
    this.connectionProvider.connectWifi();
  }

  connectionStatus() {
    this.connectionProvider.connectionStatus();
  }

  socketConnection() {
    this.socketProvider.createSocket();
  }
}
