import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { AuthState } from '../../auth/store/auth.states';
import { Patient } from '../../model/patient.model';
import { Clinic } from '../../model/clinic.model';
import { Doctor } from '../../model/doctor.model';
import { AppointmentEncounterService } from './appointment-encounter.service';

@Component({
  selector: 'app-create-appointment-encounter',
  templateUrl: './create-appointment-encounter.component.html',
  styleUrls: ['./create-appointment-encounter.component.scss'],
})
export class CreateAppointmentEncounterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  role: string;
  patientId: number;
  preferredClinic: number = null;
  storeSub$: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private appointmentEncounterService: AppointmentEncounterService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      patient: new FormControl(null, [
        Validators.required
      ]),
      clinic: new FormControl(null, [
        Validators.required
      ]),
      date: new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en"), [
        Validators.required
      ]),
      time: new FormControl(formatDate(new Date(), "HH:mm", "en"), [
        Validators.required
      ]),
      doctor: new FormControl(null, [
        Validators.required
      ]),
      comment: new FormControl(null),
    });

    this.storeSub$ = combineLatest([
      this.appointmentEncounterService.getAllClinics(),
      this.appointmentEncounterService.getAllDoctors(),
      this.appointmentEncounterService.getAllPatients(),
      this.appointmentEncounterService.getAuthStatus()
    ]).subscribe(
      ([clinics, doctors, patients, authState]: [Clinic[], Doctor[], Patient[], AuthState]) => {
        this.clinics = clinics;
        this.doctors = doctors;
        this.patients = patients
        this.role = authState.role;
        this.patientId = authState.patient_id;
        this.preferredClinic = authState.clinic;

        if (this.patientId) {
          this.populatePatient(this.patientId);
        }

        if (this.preferredClinic) {
          this.populateClinic(this.preferredClinic);
        }
      }
    );
  }

  populatePatient(id: number) {
    this.form.patchValue({
      patient: id
    });
  }

  populateClinic(id: number) {
    this.form.patchValue({
      clinic: id.toString()
    });
  }

  createAppointment() {
    this.appointmentEncounterService.createAppointment(this.form);
    this.onCancel();
  }

  createEncounter() {
    this.appointmentEncounterService.createEncounter(this.form);
    this.onCancel();
  }

  onReset() {
    this.form.reset();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.storeSub$.unsubscribe();
  }

}
