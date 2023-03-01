import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { DiagnosisService } from './diagnosis.service';
import * as wordToNumber from 'word-to-numbers';
import { Encounter } from '../model/encounter.model';
import { MicrophoneService } from '../microphone/microphone.service';
import { ConvertedText } from '../model/converted-text';
import { Role } from '../constants/role.constants';
import { Diagnosis } from '../model/diagnosis.model';
import { SearchICDComponent } from './search-icd/search-icd.component';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.page.html',
  styleUrls: ['./diagnosis.page.scss'],
})
export class DiagnosisPage implements OnInit, OnDestroy {

  form: FormGroup;
  storeSub$: Subscription;
  speechToTextSubcription$: Subscription;
  encounter: Encounter;
  diagnosis: Diagnosis;
  role: string;
  editMode = false;

  constructor(
    private diagnosisService: DiagnosisService,
    private microphoneService: MicrophoneService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      diagnosisId: new FormControl(),
      encounterId: new FormControl(null, [
        Validators.required
      ]),
      name: new FormControl(null, [
        Validators.required
      ]),
      age: new FormControl(null, [
        Validators.required
      ]),
      weight: new FormControl(null, [
        Validators.pattern('[1-9]+[0-9]*(\.[0-9]+)?')
      ]),
      height: new FormControl(null, [
        Validators.pattern('[1-9]+[0-9]*(\.[0-9]+)?')
      ]),
      signsSymptoms: new FormControl(),
      history: new FormControl(),
      bloodPressure: new FormControl(),
      heartRate: new FormControl(null, [
        Validators.pattern('[1-9]+[0-9]*')
      ]),
      respiratoryRate: new FormControl(null, [
        Validators.pattern('[1-9]+[0-9]*')
      ]),
      oxygenSat: new FormControl(null, [
        Validators.pattern('[1-9]+[0-9]*')
      ]),
      temp: new FormControl(null, [
        Validators.pattern('[1-9]+[0-9]*(\.[0-9]+)?')
      ]),
      icd: new FormControl(),
      diagnosis: new FormControl(null, [
        Validators.required
      ]),
      prescription: new FormControl()
    });

    this.storeSub$ = combineLatest([
      this.diagnosisService.getEncounterDetails(),
      this.diagnosisService.getDiagnosis(),
      this.diagnosisService.getRole()
    ]).subscribe(
        ([encounter, diagnosis, role]: [Encounter, Diagnosis, string]) => {
          this.encounter = encounter;
          this.diagnosis = diagnosis;
          this.role = role;

          if (encounter) {
            this.populateEncounter();
          }

          if (diagnosis) {
            this.populateForm();
            this.editMode = true;
          }
        }
    );

    if (this.role === Role.PATIENT) {
      this.form.disable();
    }

    this.speechToTextSubcription$ =
      this.microphoneService.transcribedText.subscribe(
        text => this.assignText(text)
      );
  }

  populateEncounter() {
    this.form.patchValue({
      encounterId: this.encounter.encounter_id,
      name: this.encounter.encounter_patient.patient_name,
      age: this.calculateAge(this.encounter.encounter_patient.patient_dob),
    });
  }

  populateForm() {
    this.form.patchValue({
      diagnosisId: this.diagnosis.diagnosis_id,
      encounterId: this.diagnosis.diagnosis_encounter,
      weight: this.diagnosis.diagnosis_weight,
      height: this.diagnosis.diagnosis_height,
      signsSymptoms: this.diagnosis.diagnosis_symptoms,
      history: this.diagnosis.diagnosis_history,
      bloodPressure: this.diagnosis.diagnosis_blood_pressure,
      heartRate: this.diagnosis.diagnosis_heart_rate,
      respiratoryRate: this.diagnosis.diagnosis_resp_rate,
      oxygenSat: this.diagnosis.diagnosis_oxy_saturation,
      temp: this.diagnosis.diagnosis_temp,
      icd: this.diagnosis.diagnosis_icd,
      diagnosis: this.diagnosis.diagnosis_descr,
      prescription: this.diagnosis.diagnosis_prescription,
    });
  }

  calculateAge(dob: string): string {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 3600 * 24) / 365.25).toString();
  }

  assignText(text: ConvertedText) {
    const converted = wordToNumber(text.text).toString().replace(/ +/g, "");

    switch (text.input) {
      case "weight":
        this.form.patchValue({
          weight: converted,
        });
        break;
      case "height":
        this.form.patchValue({
          height: converted,
        });
        break;
      case "signsSymptoms":
        this.form.patchValue({
          signsSymptoms: text.text,
        });
        break;
      case "history":
        this.form.patchValue({
          history: text.text,
        });
        break;
      case "bloodPressure":
        const bp = converted.split('slash');
        this.form.patchValue({
          bloodPressure: `${bp[0]}/${bp[1]}`,
        });
        break;
      case "heartRate":
        this.form.patchValue({
          heartRate: converted,
        });
        break;
      case "respiratoryRate":
        this.form.patchValue({
          respiratoryRate: converted,
        });
        break;
      case "oxygenSat":
        this.form.patchValue({
          oxygenSat: converted,
        });
        break;
      case "temp":
        this.form.patchValue({
          temp: converted,
        });
        break;
      case "diagnosis":
        this.form.patchValue({
          diagnosis: text.text,
        });
        break;
      case "prescription":
        this.form.patchValue({
          prescription: text.text,
        });
        break;
    }

  }

  async onSearchICD() {
    let modal;

    modal = await this.modalCtrl.create({
      component: SearchICDComponent
    });

    modal.onDidDismiss().then(
      modalData => {
        if (modalData.data) {
          this.form.patchValue({
            icd: modalData.data
          });
        }
      }
    );

    return await modal.present();
  }

  onCreateDiagnosis() {
    this.diagnosisService.createDiagnosis(this.form);
  }

  onUpdateDiagnosis() {
    this.diagnosisService.updateDiagnosis(this.form);
  }

  ngOnDestroy() {
    this.storeSub$.unsubscribe();
    this.speechToTextSubcription$.unsubscribe();
    this.diagnosisService.clearState();
  }

}
