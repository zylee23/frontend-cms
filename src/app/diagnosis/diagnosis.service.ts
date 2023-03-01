import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { selectRole } from '../auth/store/auth.selectors';
import { Diagnosis } from '../model/diagnosis.model';
import { DiagnosisActions } from './store/diagnosis.action-types';
import { selectCurrentEncounter, selectDiagnosis, selectICDResults } from './store/diagnosis.selector';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

  constructor(private store: Store<AppState>) {}

  getEncounterDetails() {
    return this.store.select(selectCurrentEncounter);
  }

  getDiagnosis() {
    return this.store.select(selectDiagnosis);
  }

  getRole() {
    return this.store.select(selectRole);
  }

  getICDResults() {
    return this.store.select(selectICDResults);
  }

  clearState() {
    this.store.dispatch(DiagnosisActions.clearState());
  }

  diagnosisToJson(form: FormGroup) {
    return {
      diagnosis_weight: form.value.weight,
      diagnosis_height: form.value.height,
      diagnosis_symptoms: form.value.signsSymptoms,
      diagnosis_history: form.value.history,
      diagnosis_blood_pressure: form.value.bloodPressure,
      diagnosis_heart_rate: form.value.heartRate,
      diagnosis_resp_rate: form.value.respiratoryRate,
      diagnosis_oxy_saturation: form.value.oxygenSat,
      diagnosis_temp: form.value.temp,
      diagnosis_descr: form.value.diagnosis,
      diagnosis_icd: form.value.icd,
      diagnosis_prescription: form.value.prescription,
      diagnosis_encounter: form.value.encounterId
    }
  }

  createDiagnosis(form: FormGroup) {
    const diagnosis: Diagnosis = this.diagnosisToJson(form);
    this.store.dispatch(DiagnosisActions.createDiagnosis({ diagnosis }));
  }

  updateDiagnosis(form: FormGroup) {
    const diagnosis: Diagnosis = this.diagnosisToJson(form);
    diagnosis.diagnosis_id = form.value.diagnosisId;

    const update: Update<Diagnosis> = {
      id: diagnosis.diagnosis_id,
      changes: diagnosis,
    };

    this.store.dispatch(DiagnosisActions.updateDiagnosis({ update }));
  }

  searchICD(query: string) {
    this.store.dispatch(DiagnosisActions.searchICD({ query }));
  }

}