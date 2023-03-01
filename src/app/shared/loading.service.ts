import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(private loadingCtrl: LoadingController) {}

  async present(message: string) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      keyboardClose: true,
      message: message
    }).then(loadingElement => {
      loadingElement.present().then(() => {
        if (!this.isLoading) {
          loadingElement.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.getTop().then(value => value ? this.loadingCtrl.dismiss() : null);
  }

}