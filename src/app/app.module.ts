import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { buildSpecificModules } from './build-specifics';
import { appReducer } from './store/app.reducer';
import { environment } from '../environments/environment';
import { AuthEffects } from './auth/store/auth.effects';
import { HeaderInterceptor } from './shared/header-interceptor.service';
import { AppointmentEffects } from './dashboard/store/appointment/appointment.effects';
import { EncounterEffects } from './dashboard/store/encounter/encounter.effects';
import { ClinicEffects } from './dashboard/store/clinic/clinic.effects';
import { DoctorEffects } from './dashboard/store/doctor/doctor.effects';
import { PatientEffects } from './dashboard/store/patient/patient.effects';
import { CreateEffects } from './create/store/create.effects';
import { DiagnosisEffects } from './diagnosis/store/diagnosis.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot(appReducer, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([
      AuthEffects,
      CreateEffects,
      AppointmentEffects,
      EncounterEffects,
      ClinicEffects,
      DoctorEffects,
      PatientEffects,
      DiagnosisEffects
    ]),
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
    ...buildSpecificModules
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
