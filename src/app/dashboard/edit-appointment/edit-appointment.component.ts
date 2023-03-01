import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CalendarEvent } from 'angular-calendar';
import { ModalController, NavParams } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { Clinic } from '../../model/clinic.model';
import { Doctor } from '../../model/doctor.model';
import { Patient } from '../../model/patient.model';
import { AuthState } from '../../auth/store/auth.states';
import { Appointment } from '../../model/appointment.model';
import { AppointmentStatus } from '../../constants/appointment-status.constants';
import { AppointmentEncounterService } from '../create-appointment-encounter/appointment-encounter.service';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss'],
})
export class EditAppointmentComponent implements OnInit, OnDestroy {

  // A reference to the appointment calendar event
  calendarEvent: CalendarEvent<Appointment>;

  form: FormGroup;
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  role: string;
  appointment: Appointment;
  canEdit: boolean = true;
  storeSub$: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private appointmentEncounterService: AppointmentEncounterService
  ) {}

  ngOnInit() {
    this.calendarEvent = this.navParams.data.event;
    this.appointment = this.calendarEvent.meta;

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
      }
    );

    this.form = new FormGroup({
      title: new FormControl(this.calendarEvent.title),
      id: new FormControl(this.appointment.appointment_id),
      patient: new FormControl(this.appointment.appointment_patient.patient_id.toString()),
      patientDetail: new FormControl(
        `${this.appointment.appointment_patient.patient_id}: ${this.appointment.appointment_patient.patient_name}`,
        [Validators.required]
      ),
      clinic: new FormControl(this.appointment.appointment_clinic.clinic_id.toString(), [
        Validators.required
      ]),
      date: new FormControl(this.appointment.appointment_date, [
        Validators.required
      ]),
      time: new FormControl(this.appointment.appointment_time, [
        Validators.required
      ]),
      doctor: new FormControl(this.appointment.appointment_doctor.doctor_id.toString(), [
        Validators.required
      ]),
      comment: new FormControl(this.appointment.appointment_comments),
      status: new FormControl(this.appointment.appointment_status)
    }, [
      // this.appointmentEncounterService.dateValidator('date', 'time')
    ]);

    if (this.appointment.appointment_status === AppointmentStatus.ATTENDED ||
      this.appointment.appointment_status === AppointmentStatus.CANCELLED) {
        this.form.disable();
        this.canEdit = false;
    }
  }

  editAppointment() {
    this.appointmentEncounterService.editAppointment(this.form);
    this.onClose();
  }

  cancelAppointment() {
    this.appointmentEncounterService.cancelAppointment(this.form);
    // this.onClose();
  }

  convertToEncounter() {
    this.appointmentEncounterService.convertAppointmentToEncounter(this.form);
    this.onClose();
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.storeSub$.unsubscribe();
  }

}
