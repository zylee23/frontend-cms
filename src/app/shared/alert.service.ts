import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  isLoading = false;

  constructor(private alertCtrl: AlertController) {}

  createAlert(header: string, message: string) {
    this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ["Okay"]
    }).then(alertEl => {
      alertEl.present();
    });

  }

}