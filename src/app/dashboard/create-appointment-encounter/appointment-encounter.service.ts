import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { selectAllClinics } from '../store/clinic/clinic.selectors';
import { selectAllDoctors } from '../store/doctor/doctor.selectors';
import { selectAllPatients } from '../store/patient/patient.selectors';
import { AppointmentActions } from '../store/appointment/action-types';
import { EncounterActions } from '../store/encounter/encounter-types';
import { selectAuthState } from 'src/app/auth/store/auth.selectors';
import { AppointmentStatus } from '../../constants/appointment-status.constants';
import { Appointment } from '../../model/appointment.model';
import { Encounter } from '../../model/encounter.model';
import { Update } from '@ngrx/entity';
import { DiagnosisActions } from 'src/app/diagnosis/store/diagnosis.action-types';
import { formatDate } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AppointmentEncounterService {

  constructor(
    private store: Store<AppState>
  ) {}

  getAllClinics() {
    return this.store.select(selectAllClinics);
  }

  getAllDoctors() {
    return this.store.select(selectAllDoctors);
  }

  getAllPatients() {
    return this.store.select(selectAllPatients);
  }

  getAuthStatus() {
    return this.store.select(selectAuthState);
  }

  appointmentToJson(form: FormGroup): Appointment {
    return {
      appointment_patient: +form.value.patient,
      appointment_clinic: +form.value.clinic,
      appointment_date: form.value.date,
      appointment_time: form.value.time,
      appointment_doctor: +form.value.doctor,
      appointment_status: AppointmentStatus.REQUESTED,
      appointment_comments: form.value.comment
    }
  }

  encounterToJson(form: FormGroup): Encounter {
    return {
      encounter_patient: +form.value.patient,
      encounter_clinic: +form.value.clinic,
      encounter_date: form.value.date,
      encounter_time: form.value.time,
      encounter_doctor: +form.value.doctor,
      // encounter_appointment: null,
      encounter_comments: form.value.comment

    }
  }

  createAppointment(form: FormGroup) {
    const appointment: Appointment = this.appointmentToJson(form);
    this.store.dispatch(AppointmentActions.createAppointment({ appointment }));
  }

  createEncounter(form: FormGroup) {
    const encounter: Encounter = this.encounterToJson(form);
    this.store.dispatch(EncounterActions.createEncounter({ encounter }));
  }

  editAppointment(form: FormGroup) {
    const appointment: Appointment = this.appointmentToJson(form)
    appointment.appointment_id = form.value.id;
    appointment.appointment_status = AppointmentStatus.RESCHEDULED;

    const update: Update<Appointment> = {
      id: appointment.appointment_id,
      changes: appointment,
    };

    this.store.dispatch(AppointmentActions.appointmentUpdated({ update }));
  }

  cancelAppointment(form: FormGroup) {
    const appointment: Appointment = this.appointmentToJson(form);
    appointment.appointment_id = form.value.id;
    appointment.appointment_status = AppointmentStatus.CANCELLED;
    const update: Update<Appointment> = {
      id: appointment.appointment_id,
      changes: appointment,
    };

    this.store.dispatch(AppointmentActions.cancelAppointment({ appointment: update }));
  }

  convertAppointmentToEncounter(form: FormGroup) {
    const appointment: Appointment = this.appointmentToJson(form);
    appointment.appointment_id = form.value.id;
    appointment.appointment_status = AppointmentStatus.ATTENDED;
    const update: Update<Appointment> = {
      id: appointment.appointment_id,
      changes: appointment,
    };

    const encounter: Encounter = this.encounterToJson(form);
    encounter.encounter_appointment = appointment.appointment_id;

    // this.store.dispatch(AppointmentActions.appointmentUpdated({ update }));
    // this.store.dispatch(EncounterActions.createEncounter({ encounter }));
    this.store.dispatch(AppointmentActions.convertToEncounter({
      appointment: update,
      encounter
    }));
  }

  editEncounter(form: FormGroup) {
    const encounter: Encounter = this.encounterToJson(form)
    encounter.encounter_id = form.value.id;
    if (form.value.appointment) {
      encounter.encounter_appointment = form.value.appointment;
    }

    const update: Update<Encounter> = {
      id: encounter.encounter_id,
      changes: encounter,
    };

    this.store.dispatch(EncounterActions.encounterUpdated({ update }));
  }

  deleteEncounter(form: FormGroup) {
    this.store.dispatch(EncounterActions.deleteEncounter({ encounterId: form.value.id }));
  }

  saveEncounterDetails(encounter: Encounter) {
    this.store.dispatch(DiagnosisActions.saveEncounterDetails({ encounter }));
  }

  dateValidator(date: string, time: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateCtrl = control.get(date).value;
      const timeCtrl = control.get(time).value;
      const today = new Date();
      const inputDate = new Date(dateCtrl);

      if (dateCtrl == today.toISOString().split('T')[0]) {
        return timeCtrl < formatDate(today, "HH:mm", "en")
        ? { invalid: true }
        : null;
      }

      return inputDate.getTime() < today.getTime()
        ? { invalid: true }
        : null;
    };
  }

}