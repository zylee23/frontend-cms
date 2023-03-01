import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addHours } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import { Appointment } from '../../model/appointment.model';
import { selectAllAppointments } from '../store/appointment/appointment.selectors';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';
import { Encounter } from 'src/app/model/encounter.model';
import { selectAllEncounters } from '../store/encounter/encounter.selectors';
import { EditEncounterComponent } from '../edit-encounter/edit-encounter.component';

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, OnDestroy {
  /**
   * Indicate the default calendar view.
   */
  view: CalendarView = CalendarView.Week;

  /**
   * Indicate the date of the current day.
   */
  viewDate: Date = new Date();

  /**
   * A list of CalendarEvent to display.
   */
  events: CalendarEvent<Appointment|Encounter>[] = [];

  /**
   * A Subject for refreshing the UI.
   */
  refresh: Subject<any> = new Subject<any>();

  appointments$: Subscription;
  encounters$: Subscription;

  constructor(
    private modalController: ModalController,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    // Appointment stream to listen for requested Appointments
    this.appointments$ = this.store.pipe(
      select(selectAllAppointments),
      map(appointments => {
        const calendarEvents: CalendarEvent<Appointment>[] = appointments.map(appointment => {
          // Parse date + time based on ISO standards defined for TypeScript
          const dateTime: Date = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
          return {
            id: appointment.appointment_id,
            start: dateTime,
            end: addHours(dateTime, 1),
            title: `Appointment ${appointment.appointment_id}: ${appointment.appointment_patient.patient_name} & Dr ${appointment.appointment_doctor.doctor_name}`,
            color: colors.blue,
            meta: appointment,
          }
        });

        return calendarEvents;
      })
    ).subscribe(action => {
      // Remove matching existing calendar events to prevent duplicate entries
      action.forEach(a => {
        const index = this.events.findIndex(event => event.meta["appointment_id"] === a.meta.appointment_id);
        if (index > -1) {
          this.events.splice(index, 1);
        }
      });
      this.events = this.events.concat(action);
      // Update view
      this.refresh.next();
    });

    // Encounter stream to listen for requested Encounters
    this.encounters$ = this.store.pipe(
      select(selectAllEncounters),
      map(appointments => {
        const calendarEvents: CalendarEvent<Encounter>[] = appointments.map(encounter => {
          // Parse date + time based on ISO standards defined for TypeScript
          const dateTime: Date = new Date(`${encounter.encounter_date}T${encounter.encounter_time}`);
          return {
            id: encounter.encounter_id,
            start: dateTime,
            end: addHours(dateTime, 1),
            title: `Encounter ${encounter.encounter_id}: ${encounter.encounter_patient.patient_name} & Dr ${encounter.encounter_doctor.doctor_name}`,
            color: colors.yellow,
            meta: encounter,
          }
        });

        return calendarEvents;
      })
    ).subscribe(action => {
      // Remove matching existing calendar events to prevent duplicate entries
      action.forEach(a => {
        const index = this.events.findIndex(event => event.meta["encounter_id"] === a.meta.encounter_id);
        if (index > -1) {
          this.events.splice(index, 1);
        }
      })
      this.events = this.events.concat(action);
      // Update view
      this.refresh.next();
    });
  }

  ngOnDestroy(): void {
    this.appointments$.unsubscribe();
    this.encounters$.unsubscribe();
  }

  async onEventClicked(event) {
    // console.log("onEventClicked");
    // console.log(event);

    let modal;
    // Check for the type of calendar event before opening the specified modals
    if (event.event.meta["appointment_id"]) {
      modal = await this.modalController.create({
        component: EditAppointmentComponent,
        componentProps: {
          event: event.event,
        }
      });

      // Receive appointment id on deleting an appointment to update calendar view
      modal.onDidDismiss().then((modelData) => {
        // console.log(modelData);
        if (modelData.data) {
          const index = this.events.findIndex(event => event.meta["appointment_id"] === modelData.data);
          this.events.splice(index, 1);
          // Update view
          this.refresh.next();
        }
      });

    } else {
      modal = await this.modalController.create({
        component: EditEncounterComponent,
        componentProps: {
          event: event.event,
        }
      });

      // Receive encounter id on deleting an encounter to update calendar view
      modal.onDidDismiss().then((modelData) => {
        // console.log(modelData);
        if (modelData.data) {
          const index = this.events.findIndex(event => event.meta["encounter_id"] === modelData.data);
          this.events.splice(index, 1);
          // Update view
          this.refresh.next();
        }
      });
    }

    return await modal.present();
  }
}
