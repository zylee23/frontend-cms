import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegistrationPage } from './registration.page';
import { MicrophoneComponentModule } from '../microphone/microphone.module';
import { ClinicResolver } from '../dashboard/store/clinic/clinic.resolver';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage,
    resolve: {
      clinics: ClinicResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MicrophoneComponentModule,
  ],
  declarations: [
    RegistrationPage,
  ],
  providers: [
    ClinicResolver
  ]
})
export class RegistrationPageModule {}
