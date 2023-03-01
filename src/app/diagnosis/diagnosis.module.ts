import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DiagnosisPage } from './diagnosis.page';
import { MicrophoneComponentModule } from '../microphone/microphone.module';
import { SearchICDComponent } from './search-icd/search-icd.component';

const routes: Routes = [
  {
    path: '',
    component: DiagnosisPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MicrophoneComponentModule
  ],
  declarations: [
    DiagnosisPage,
    SearchICDComponent
  ]
})
export class DiagnosisPageModule {}
