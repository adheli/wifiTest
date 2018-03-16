import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ConnectionProvider } from './../../providers/connection/connection';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private connectionProvider: ConnectionProvider) {

  }

  connectWifi() {
    const connected = this.connectionProvider.connect();

    if (connected) {
      const alert = this.alertCtrl.create({
        title: 'Connected?',
        subTitle: 'YES!',
        buttons: ['Well done!']
      });

      alert.present();
    }
  }

  connectionStatus() {
    const isConnected = this.connectionProvider.isConnected();

    if (isConnected) {
      const connInfo = this.connectionProvider.status();

      const alert = this.alertCtrl.create({
        title: 'Status',
        message: JSON.stringify(connInfo),
        buttons: ['Well done!']
      });

      alert.present();
    }
  }
}
