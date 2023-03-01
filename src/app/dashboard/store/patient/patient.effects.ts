import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { catchError,  map, switchMap } from "rxjs/operators";
import { PatientActions } from "./patient-types";
import { Patient } from "../../../model/patient.model";
import { environment } from "../../../../environments/environment";

@Injectable()
export class PatientEffects {

  api = environment.api_url;

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  loadAllPatients$ = createEffect(
    () => this.actions$.pipe(
      ofType(PatientActions.loadAllPatients),
      switchMap(_ => {
        return this.http.get<Patient[]>(`${this.api}/users/patients/`).pipe(
          map(responseData => {
            return PatientActions.allPatientsLoaded({ patients: responseData });
          }),
          catchError(responseError => {
            return EMPTY;
          })
        );
      })
    )
  );

}