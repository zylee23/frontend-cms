import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MicrophoneComponent } from '../microphone/microphone.component';

@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [
    MicrophoneComponent,
  ],
  exports: [
    MicrophoneComponent,
  ]
})
export class MicrophoneComponentModule {}
