import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthActions } from "./auth.action-types";
import { LoadingService } from "../../shared/loading.service";
import { AlertService } from "../../shared/alert.service";
import { Role } from "../../constants/role.constants";
import { Route } from '../../constants/route.constants';
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthEffects {

  api = environment.api_url;
  storageKey = "userData";

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  // return authentication success action from the response data
  authenticateSuccess = (response: any) => {
    const role = response.user.role;
    let username: string = null;
    let patient_id: number = null;
    let clinic: number = null;

    if (role === Role.PATIENT) {
      username = response.user.patient_info.patient_name;
      patient_id = response.user.patient_info.patient_id;
      clinic = response.user.patient_info.patient_clinic;
    } else if (role === Role.DOCTOR) {
      username = response.user.doctor_info.doctor_name;
      clinic = response.user.doctor_info.doctor_clinic;
    } else if (role === Role.ADMIN) {
      username = response.user.admin_info.admin_name;
      clinic = response.user.admin_info.admin_clinic;
    }

    const userData = {
      token: response.token,
      patient_id: patient_id,
      clinic: clinic,
      username: username,
      role: role
    };
    return AuthActions.authSuccess({ userData });
  };

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap(action => {
      this.loadingService.present("Logging In...");

      return this.http.post(
        `${this.api}/users/token/`,
        {
          email: action.email,
          password: action.password
        }
      ).pipe(
        map(responseData => {
          this.loadingService.dismiss();
          return this.authenticateSuccess(responseData);
        }),
        catchError(responseError => {
          this.loadingService.dismiss();
          this.alertService.createAlert("Login failed", "Could not login");
          return of(AuthActions.authFail());
        })
      )
    })
  ));

  authSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.authSuccess),
      tap(action => {
        // TODO: refactor string constant
        localStorage.setItem(this.storageKey, JSON.stringify(action.userData));
        this.router.navigateByUrl(Route.DASHBOARD);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem(this.storageKey);
        this.router.navigateByUrl(Route.LANDING);
      })
    ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          patient_id: number;
          clinic: number;
          username: string;
          role: string;
          token: string;
        } = JSON.parse(localStorage.getItem(this.storageKey));
        if (userData) {
          return AuthActions.authSuccess({ userData });
        }
        // dummy action
        return { type: 'DUMMY' };
      })
    )
  });

}