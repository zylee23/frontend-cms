import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateAppointmentEncounterComponent } from './create-appointment-encounter/create-appointment-encounter.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {

  constructor(private modalCtrl: ModalController) { }

  createAppointment() {
    this.modalCtrl.create({
      component: CreateAppointmentEncounterComponent
    }).then(modal => {
      modal.present();
    })
  }

}
