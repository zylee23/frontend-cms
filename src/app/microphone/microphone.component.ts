import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { MicrophoneService } from './microphone.service';

@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss'],
})
export class MicrophoneComponent implements OnInit {
  /**
   * This is used to identify how the microphone is being used in an text input
   * form control
   */
  @Input() input: string;

  isRecording: boolean = false;

  /**
   * Is the application being used on a mobile device?
   */
  private isMobile: boolean = false;

  constructor(
    private microphoneService: MicrophoneService,
    private platform: Platform,
  ) {}

  ngOnInit() {
    if (this.platform.is("mobile")) {
      this.isMobile = true;
      // Request user permission before using microphone
      VoiceRecorder.requestAudioRecordingPermission();
    }
  }

  /**
   * Initiate or stop recording on tapping microphone.
   */
  onTapMicrophone() {
    if (this.isRecording) {
      this.isRecording = false;
      if (this.isMobile)
        this.microphoneService.onCancelMicrophoneMobile(this.input);
      else
        this.microphoneService.onCancelMicrophone(this.input);
    } else {
      this.isRecording = true;
      if (this.isMobile)
        this.microphoneService.onTapMicrophoneMobile();
      else
        this.microphoneService.onTapMicrophone();
    }
  }
}
