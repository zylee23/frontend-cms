import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MicrophoneService } from '../../microphone/microphone.service';
import { DiagnosisService } from '../diagnosis.service';
import { ConvertedText } from '../../model/converted-text';
import * as wordToNumber from 'word-to-numbers';

@Component({
  selector: 'app-search-icd',
  templateUrl: './search-icd.component.html',
  styleUrls: ['./search-icd.component.scss'],
})
export class SearchICDComponent implements OnInit, OnDestroy {

  form: FormGroup;
  storeSub$: Subscription;
  speechToTextSubcription$: Subscription;
  results: string[] = [];
  converted: string;

  constructor(
    private modalCtrl: ModalController,
    private diagnosisService: DiagnosisService,
    private microphoneService: MicrophoneService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      icd: new FormControl(null, [
        Validators.required
      ])
    });

    this.storeSub$ = this.diagnosisService.getICDResults().subscribe({
      next: resolve => {
        this.results = resolve;
      }
    });

    this.speechToTextSubcription$ =
      this.microphoneService.transcribedText.subscribe(
        text => {
          this.converted = wordToNumber(text.text).toString();
          this.diagnosisService.searchICD(this.converted);
        }
      );
  }

  onSearch(event: any) {
    this.diagnosisService.searchICD(event.target.value);
  }

  onSelect() {
    if (this.form.value.icd) {
      this.modalCtrl.dismiss(this.form.value.icd);
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.storeSub$.unsubscribe();
    this.speechToTextSubcription$.unsubscribe();
  }

}
