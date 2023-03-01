import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { CalendarDateFormatter, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { DashboardPage } from './dashboard.page';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarHeaderComponent } from './calendar/calendar-header/calendar-header.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { AppointmentResolver } from './store/appointment/appointment.resolver';
import { EncounterResolver } from './store/encounter/encounter.resolver';
import { EditEncounterComponent } from './edit-encounter/edit-encounter.component';
import { ClinicResolver } from './store/clinic/clinic.resolver';
import { DoctorResolver } from './store/doctor/doctor.resolver';
import { CustomDateFormatter } from './calendar/calendar-formatter.service';
import { CreateAppointmentEncounterComponent } from './create-appointment-encounter/create-appointment-encounter.component';
import { PatientResolver } from './store/patient/patient.resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    resolve: {
      appointments: AppointmentResolver,
      encounters: EncounterResolver,
      clinics: ClinicResolver,
      doctors: DoctorResolver,
      patients: PatientResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  declarations: [
    DashboardPage,
    CalendarComponent,
    CalendarHeaderComponent,
    EditAppointmentComponent,
    EditEncounterComponent,
    CreateAppointmentEncounterComponent
  ],
  providers: [
    AppointmentResolver,
    EncounterResolver,
    ClinicResolver,
    DoctorResolver,
    PatientResolver,
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ]
})
export class DashboardPageModule {
  /**
   * Stores the Platform injector service as a static field to be used within
   * the scope of this module
   */
  static platformInjector: Platform;

  constructor(platformInjector: Platform) {
    DashboardPageModule.platformInjector = platformInjector;
  }
}
