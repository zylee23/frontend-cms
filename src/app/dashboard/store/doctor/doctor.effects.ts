import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { DoctorActions } from "./doctor-types";
import { Doctor } from "../../../model/doctor.model";
import { environment } from "../../../../environments/environment";

@Injectable()
export class DoctorEffects {

    api = environment.api_url;

    constructor(
      private actions$: Actions,
      private http: HttpClient
    ) {}

    loadAllDoctors$ = createEffect(
      () => this.actions$.pipe(
        ofType(DoctorActions.loadAllDoctors),
        switchMap(_ => {
          return this.http.get<Doctor[]>(`${this.api}/users/doctors/`).pipe(
            map(responseData => {
              return DoctorActions.allDoctorsLoaded({ doctors: responseData });
            }),
            catchError(responseError => {
              return EMPTY;
            })
          );
        })
      )
    );

}
