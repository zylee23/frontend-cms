import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Subject } from 'rxjs';
import { ConvertedText } from '../model/converted-text';
import { environment } from '../../environments/environment';

// Importing the RecordRTC as it was intially built for JS.
declare var require: any  // Simple fix to import require but not recommended
let RecordRTC = require('recordrtc/RecordRTC.min');
let StereoAudioRecorder = require('recordrtc').StereoAudioRecorder
StereoAudioRecorder = RecordRTC.StereoAudioRecorder

/**
 * The HTTP response containing the transcription.
 */
interface SpeechToTextResponse {
  data: {
    text: string;
    words: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MicrophoneService implements OnDestroy {

  api = environment.api_url;

  // Store the current recorder instance for recording audio
  private recorder;

  /**
   * Subject used to communicate the converted speech to text data
   */
  transcribedText: Subject<ConvertedText> = new Subject<ConvertedText>();

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {}

  ngOnDestroy(): void {
    this.transcribedText.unsubscribe();
  }

  /**
   * Initiate microphone on web browsers.
   */
  onTapMicrophone() {
    // console.log("Tapped microphone icon!");
    this.handleAction();
  }

  /**
   * Start speech recording on web browsers.
   */
  async handleAction() {
    // console.log("Start Recording");
    await this.recordAudio();
  };

  /**
   * Records speech on web browsers.
   */
  async recordAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      this.successCallback.bind(this),
      this.errorCallback.bind(this)
    );
  }

  /**
   * Process the recording on successful recording of speech on web browsers.
   */
  successCallback(stream) {
    var options = {
      mimeType: "audio/wav",
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
    };
    this.recorder = RecordRTC(stream, options);
    this.recorder.startRecording();
  }

  /**
   * Error handler on unsuccessful recording of speech on web browsers.
   */
  errorCallback(error) {
    // console.log(error);
  }

  /**
   * Stop speech recording and convert it to text on web browsers.
   *
   * @param input the form control name the converted text should bind to
   */
  onCancelMicrophone(input: string) {
    this.recorder.stopRecording(this.processRecording.bind(this, input));
  }

  /**
   * Start speech recording on mobile devices.
   */
  onTapMicrophoneMobile() {
    VoiceRecorder.startRecording();
  }

  /**
   * Stop speech recording and convert it to text on mobile devices.
   *
   * @param input the form control name the converted text should bind to
   */
  onCancelMicrophoneMobile(input: string) {
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        // Display a loading indicator while processing speech
        const loading = await this.loadingController.create({
          message: "Currently processing speech, please hold on",
        });
        loading.present();
        const base64AudioJson = {
          "data": result.value.recordDataBase64,
        }
        this.http.post(`${this.api}/stt/mobile/`, base64AudioJson).subscribe(
          async (speechToTextRes: SpeechToTextResponse) => {
            await loading.dismiss();
            // console.log(speechToTextRes);
            if (speechToTextRes.data.words) {
              // Send transcribed text to registration component
              this.transcribedText.next({
                input: input,
                text: speechToTextRes.data.text,
              });
            } else {
              // Alert user on failed transcription
              this.alertController.create({
                header: "Failed Transcription",
                message: "Sorry, we could not hear what you were saying. Please try again",
                buttons: [
                  {
                    text: "TRY AGAIN",
                    role: "cancel",
                  },
                ],
              }).then(alertEl => {
                alertEl.present();
              });
            }
          },
          async (errorData) => {
            await loading.dismiss();
            // console.log(errorData);
            // Alert user on failed transcription
            this.alertController.create({
              header: "Failed Transcription",
              message: "An error occurred while processing your speech. Please check your internet connection and try again",
              buttons: [
                {
                  text: "TRY AGAIN",
                  role: "cancel",
                },
              ],
            }).then(alertEl => {
              alertEl.present();
            });
          }
        )
      }
    });
  }

  /**
   * Process speech recording and convert it to text on web browsers.
   *
   * @param input the form control name the converted text should bind to
   */
  private async processRecording(input: string, _) {
    // Display a loading indicator while processing speech
    const loading = await this.loadingController.create({
      message: "Currently processing speech, please hold on",
    });
    loading.present();

    // Retrieve the recorded Blob
    const recordedBlob = this.recorder.getBlob();
    // console.log(recordedBlob);

    // Initialise File object with the Blob
    const fileObject = new File([recordedBlob], "speech.wav", {
      type: 'audio/wav'
    });
    // console.log(fileObject);

    // Transcribe speech to text
    this.http.post(`${this.api}/stt/`, fileObject).subscribe(
      async (speechToTextRes: SpeechToTextResponse) => {
        await loading.dismiss();
        // console.log(speechToTextRes);
        if (speechToTextRes.data.words) {
          // Send transcribed text to registration component
          this.transcribedText.next({
            input: input,
            text: speechToTextRes.data.text,
          });
        } else {
          // Alert user on failed transcription
          this.alertController.create({
            header: "Failed Transcription",
            message: "Sorry, we could not hear what you were saying. Please try again",
            buttons: [
              {
                text: "TRY AGAIN",
                role: "cancel",
              },
            ],
          }).then(alertEl => {
            alertEl.present();
          });
        }
      },
      async (errorData) => {
        await loading.dismiss();
        // console.log(errorData);
        // Alert user on failed transcription
        this.alertController.create({
          header: "Failed Transcription",
          message: "An error occurred while processing your speech. Please check your internet connection and try again",
          buttons: [
            {
              text: "TRY AGAIN",
              role: "cancel",
            },
          ],
        }).then(alertEl => {
          alertEl.present();
        });
      }
    )
  }
}
