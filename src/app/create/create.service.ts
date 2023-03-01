import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { CreateActions } from './store/create.action-types';
import { Create, adminToJson, doctorToJson, clinicToJson, patientToJson } from '../model/create.model';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  constructor(private store: Store<AppState>) {}

  createAdmin(admin: Create) {
    this.store.dispatch(CreateActions.createAdmin({ admin: adminToJson(admin) }));
  }

  createDoctor(doctor: Create) {
    this.store.dispatch(CreateActions.createDoctor({ doctor: doctorToJson(doctor) }));
  }

  createPatient(patient: Create) {
    this.store.dispatch(CreateActions.createPatient({ patient: patientToJson(patient) }));
  }

  createClinic(clinic: Create) {
    this.store.dispatch(CreateActions.createClinic({ clinic: clinicToJson(clinic) }));
  }

}