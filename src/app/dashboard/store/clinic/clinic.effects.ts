import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ClinicActions } from "./clinic-types";
import { Clinic } from "../../../model/clinic.model";
import { environment } from "../../../../environments/environment";

@Injectable()
export class ClinicEffects {

  api = environment.api_url;

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  loadAllClinics$ = createEffect(
    () => this.actions$.pipe(
      ofType(ClinicActions.loadAllClinics),
      switchMap(_ => {
        return this.http.get<Clinic[]>(`${this.api}/clinic/clinics/`).pipe(
          map(responseData => {
            return ClinicActions.allClinicsLoaded({ clinics: responseData });
          }),
          catchError(responseError => {
            return EMPTY;
          })
        );
      })
    )
  );

}
