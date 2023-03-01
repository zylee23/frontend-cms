import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ModalController } from "@ionic/angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, forkJoin } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { LoadingService } from "../../../shared/loading.service";
import { AlertService } from "../../../shared/alert.service";
import { Appointment } from "../../../model/appointment.model";
import { Encounter } from "../../../model/encounter.model";
import { AppointmentActions } from "./action-types";
import { environment } from "../../../../environments/environment";

@Injectable()
export class AppointmentEffects {

  api = environment.api_url;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private modalCtrl: ModalController
  ) {}

  loadAllAppointments$ = createEffect(
    () => this.actions$.pipe(
      ofType(AppointmentActions.loadAllAppointments),
      switchMap(_ => {
        return this.http.get<Appointment[]>(`${this.api}/appointment/appointments/`).pipe(
          map(responseData => {
            return AppointmentActions.allAppointmentsLoaded({ appointments: responseData });
          }),
          catchError(responseError => {
            return EMPTY;
          })
        );
      })
    )
  );

  createAppointment$ = createEffect(
    () => this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      switchMap((action) => {
        this.loadingService.present("Creating Appointment...");

        return this.http.post<Appointment>(
          `${this.api}/appointment/appointments/`,
          action.appointment
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Appointment Created!", "Appointment created successfully");
            return AppointmentActions.createAppointmentSuccess({ appointment: responseData });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failed!", "Appointment could not be created");
            return EMPTY;
          })
        )
      })
    )
    // { dispatch: false }
  );

  updateAppointment$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(AppointmentActions.appointmentUpdated),
        switchMap((action) => {
          this.loadingService.present("Updating Appointment...");
          const updatedAppointment = action.update.changes;

          const appoinmentId = updatedAppointment.appointment_id;
          const body = {
            ...updatedAppointment
          };

          return this.http.put<Appointment>(
            `${this.api}/appointment/appointments/${appoinmentId}/`,
            body,
          ).pipe(
            map(responseData => {
              this.loadingService.dismiss();
              this.alertService.createAlert("Appointment Updated!", "Appointment updated successfully");
              return AppointmentActions.appointmentUpdatedSuccess({ updated: responseData });
            }),
            catchError(responseError => {
              this.loadingService.dismiss();
              this.alertService.createAlert("Failed!", "Appointment could not be updated");
              return EMPTY;
            })
          );
        }),
      )
  );

  convertToEncounter$ = createEffect(
    () => this.actions$.pipe(
      ofType(AppointmentActions.convertToEncounter),
      switchMap(action => {
        this.loadingService.present("Converting Appointment...");

        const updatedAppointment = action.appointment.changes;
        const appoinmentId = updatedAppointment.appointment_id;

        return forkJoin([
          this.http.put<Appointment>(
            `${this.api}/appointment/appointments/${appoinmentId}/`,
            { ...updatedAppointment }
          ),
          this.http.post<Encounter>(
            `${this.api}/encounter/encounters/`,
            action.encounter
          )
        ]).pipe(
          map(([appointmentResponse, encounterResponse]) => {
            this.loadingService.dismiss();
            this.alertService.createAlert(
              "Appointment Converted!",
              "Appointment converted into an encounter successfully"
            );
            return AppointmentActions.convertToEncounterSuccess({
              appointment: appointmentResponse,
              encounter: encounterResponse
            });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failed!", "Appointment could not be converted");
            return EMPTY;
          })
        );
      })
    )
  );

  cancelAppointment$ = createEffect(
    () => this.actions$.pipe(
      ofType(AppointmentActions.cancelAppointment),
      switchMap(action => {
        this.loadingService.present("Cancelling Appointment...");
          const updatedAppointment = action.appointment.changes;
          const appoinmentId = updatedAppointment.appointment_id;

          return this.http.put<Appointment>(
            `${this.api}/appointment/appointments/${appoinmentId}/`,
            { ...updatedAppointment },
          ).pipe(
            map(responseData => {
              this.modalCtrl.dismiss(responseData.appointment_id);
              this.loadingService.dismiss();
              this.alertService.createAlert("Appointment Cancelled!", "Appointment cancelled successfully");
              return AppointmentActions.cancelAppointmentSuccess({ appointment: responseData });
            }),
            catchError(responseError => {
              this.loadingService.dismiss();
              this.alertService.createAlert("Failed!", "Appointment could not be cancelled");
              return EMPTY;
            })
          );
      })
    )
  );

}