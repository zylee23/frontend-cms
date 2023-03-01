import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { CreateActions } from "./create.action-types";
import { LoadingService } from "../../shared/loading.service";
import { AlertService } from "../../shared/alert.service";
import { Route } from "../../constants/route.constants";
import { Clinic } from "../../model/clinic.model";
import { environment } from "../../../environments/environment";

@Injectable()
export class CreateEffects {

  api = environment.api_url;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private router: Router
    ) {}

  createAdmin$ = createEffect(
    () => this.actions$.pipe(
      ofType(CreateActions.createAdmin),
      switchMap(action => {
        this.loadingService.present("Creating Admin...");

        return this.http.post(
          `${this.api}/users/admins/create/`,
          action.admin
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Sucess", "Admin created successfully!");
            this.goToDashboard();
            return CreateActions.createAdminSuccess({ admin: action.admin });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failure", responseError.error.detail);
            return EMPTY;
          })
        );
      })
    )
  );

  createDoctor$ = createEffect(
    () => this.actions$.pipe(
      ofType(CreateActions.createDoctor),
      switchMap(action => {
        this.loadingService.present("Creating Doctor...");

        return this.http.post<{
          email: string,
          id: number,
          role: string,
          doctor_info: any
        }>(
          `${this.api}/users/doctors/create/`,
          action.doctor
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Sucess", "Doctor created successfully!");
            this.goToDashboard();
            return CreateActions.createDoctorSuccess({ doctor: responseData.doctor_info });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failure", responseError.error.detail);
            return EMPTY;
          })
        );
      })
    )
  );

  createPatient$ = createEffect(
    () => this.actions$.pipe(
      ofType(CreateActions.createPatient),
      switchMap(action => {
        this.loadingService.present("Creating Patient...");

        return this.http.post<{
          email: string,
          id: number,
          role: string,
          patient_info: any
        }>(
          `${this.api}/users/patients/create/`,
          action.patient
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Sucess", "Patient created successfully!");
            this.goToDashboard();
            return CreateActions.createPatientSuccess({ patient: responseData.patient_info });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failure", responseError.error.detail);
            return EMPTY;
          })
        );
      })
    )
  );

  createClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(CreateActions.createClinic),
      switchMap(action => {
        this.loadingService.present("Creating Clinic...");

        return this.http.post<Clinic>(
          `${this.api}/clinic/clinics/`,
          action.clinic
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Sucess", "Clinic created successfully!");
            this.goToDashboard();
            return CreateActions.createClinicSuccess({ clinic: responseData });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failure", responseError.error.detail);
            return EMPTY;
          })
        );
      })
    )
  );

  goToDashboard() {
    this.router.navigateByUrl(Route.DASHBOARD);
  }

}