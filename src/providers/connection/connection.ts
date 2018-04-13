import { Injectable } from '@angular/core';

import { LoadingController, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Hotspot } from '@ionic-native/hotspot';

import { boardWifiSSID, boardWifiPwd } from './../../util/constants';

/*
  Generated class for the ConnectionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectionProvider {

  private loader: any;

  constructor(private network: Network,
    private hotspot: Hotspot,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    console.log('Hello ConnectionProvider Provider');
  }

  private isConnected(callback) {
    let connectSubscription = this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        callback({ connected: true });
      });
    }, error => {
      setTimeout(() => {
        callback({ connected: false });
      });
    });

    connectSubscription.unsubscribe();
  }

  public disconnected(callback) {
    const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      setTimeout(() => {
        return callback({ connected: false });
      });
    });

    disconnectSubscription.unsubscribe();
  }

  private connect(callback) {
    this.hotspot.isWifiOn().then(isOn => {
      this.hotspot.connectToWifi(boardWifiSSID, boardWifiPwd).then(success => {
        setTimeout(() => {
          return callback({ connected: true });
        });
      }, onrejected => {
        console.error(onrejected);

        setTimeout(() => {
          return callback({ connected: false });
        });
      }).catch(error => {
        console.error(error);

        setTimeout(() => {
          return callback({ connected: false });
        });
      });
    });
  }

  private status(callback) {
    this.hotspot.getConnectionInfo().then(hotspotInfo => {
      console.log(hotspotInfo);
      if (+hotspotInfo.networkID !== -1) {
        setTimeout(() => {
          callback({
            connected: true,
            wifiName: hotspotInfo.SSID,
            ipAddress: hotspotInfo.IPAddress,
            network: hotspotInfo.networkID
          });
        });
      } else {
        setTimeout(() => {
          callback({ connected: false });
        });
      }
    });
  }


  private showLoading(): void {
    this.loader = this.loadingCtrl.create({ content: 'Carregando' });
    this.loader.present();
  }

  connectWifi() {
    this.showLoading();

    this.connect(result => {
      this.loader.dismiss();
      if (result.connected) {
        localStorage.setItem('connected', 'y');

        const alert = this.alertCtrl.create({
          title: 'Connected?',
          subTitle: 'YES!',
          buttons: ['Well done!']
        });

        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Connected?',
          message: 'NO!',
          buttons: ['oh damn!']
        });

        alert.present();
      }
    });
  }

  connectionStatus() {
    this.status(result => {
      console.log(result);
      if (result.connected) {
        const connInfo = JSON.stringify(result);

        const alert = this.alertCtrl.create({
          title: 'Status',
          message: connInfo,
          buttons: ['Well done!']
        });

        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Status',
          message: 'no connection',
          buttons: ['oh damn!']
        });

        alert.present();
      }
    });
  }
}
