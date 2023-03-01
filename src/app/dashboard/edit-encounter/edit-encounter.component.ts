import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Encounter } from '../../model/encounter.model';
import { Role } from 'src/app/constants/role.constants';

@Component({
  selector: 'app-edit-encountert',
  templateUrl: './edit-encounter.component.html',
  styleUrls: ['./edit-encounter.component.scss'],
})
export class EditEncounterComponent implements OnInit, OnDestroy {

  // A reference to the encounter calendar event
  calendarEvent: CalendarEvent<Encounter>;

  form: FormGroup;
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  role: string;
  encounter: Encounter;
  // canEdit: boolean = true;
  storeSub$: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private appointmentEncounterService: AppointmentEncounterService
  ) {}

  ngOnInit() {
    this.calendarEvent = this.navParams.data.event;
    this.encounter = this.calendarEvent.meta;

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
      id: new FormControl(this.encounter.encounter_id),
      appointment: new FormControl(this.encounter.encounter_appointment),
      patient: new FormControl(this.encounter.encounter_patient.patient_id.toString()),
      patientDetail: new FormControl(
        `${this.encounter.encounter_patient.patient_id}: ${this.encounter.encounter_patient.patient_name}`,
        [Validators.required]
      ),
      clinic: new FormControl(this.encounter.encounter_clinic.clinic_id.toString(), [
        Validators.required
      ]),
      date: new FormControl(this.encounter.encounter_date, [
        Validators.required
      ]),
      time: new FormControl(this.encounter.encounter_time, [
        Validators.required
      ]),
      doctor: new FormControl(this.encounter.encounter_doctor.doctor_id.toString(), [
        Validators.required
      ]),
      comment: new FormControl(this.encounter.encounter_comments),
    }, [
      // this.appointmentEncounterService.dateValidator('date', 'time')
    ]);

    if (this.role === Role.PATIENT) {
        this.form.disable();
        // this.canEdit = false;
    }
  }

  editEncounter() {
    this.appointmentEncounterService.editEncounter(this.form);
    this.onCancel();
  }

  deleteEncounter() {
    this.appointmentEncounterService.deleteEncounter(this.form);
  }

  goToDiagnosis() {
    this.appointmentEncounterService.saveEncounterDetails(this.calendarEvent.meta);
    this.onCancel();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.storeSub$.unsubscribe();
  }

}
