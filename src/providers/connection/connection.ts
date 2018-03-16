import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';

import { standardWifSSID, standardWifiPwd } from './../../util/constants';

/*
  Generated class for the ConnectionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectionProvider {

  constructor(public http: HttpClient, private network: Network, private hotspot: Hotspot) {
    console.log('Hello ConnectionProvider Provider');
  }

  public isConnected(): boolean {
    let isConnected = false;
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
      isConnected = true;
    }, error => {
      isConnected = false;
      console.log(error);
    });

    connectSubscription.unsubscribe();
    return isConnected;
  }

  public disconnected() {
    const disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });

    disconnectSubscription.unsubscribe();
  }

  public connect() {
    let isConnected = false;

    this.hotspot.isWifiOn().then(isOn => {

      this.hotspot.connectToWifi(standardWifSSID, standardWifiPwd).then(success => {
        console.log('connected!');
        isConnected = true;
      }, onrejected => {
        console.log('onrejected');
        console.log(onrejected);
      }).catch(error => {
        isConnected = false;
        console.log(error);
      });

    }, onRejected => {
      console.log('onrejected');
      console.log(onRejected);
    }).catch(error => {
      console.error(error);
    })

    return isConnected;
  }

  public status(): any {
    let info = {};

    this.hotspot.getConnectionInfo().then(hotspotInfo => {
      info = {
        wifiName: hotspotInfo.SSID,
        ipAddress: hotspotInfo.IPAddress,
        network: hotspotInfo.networkID
      };
    }, onrejected => {
      console.log('onrejected');
      console.log(onrejected);
    }).catch(error => {
      console.error(error);
    });

    return info;
  }
}
