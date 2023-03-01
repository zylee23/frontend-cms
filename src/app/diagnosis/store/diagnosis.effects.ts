import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { LoadingService } from "../../shared/loading.service";
import { AlertService } from "../../shared/alert.service";
import { DiagnosisActions } from "./diagnosis.action-types";
import { Diagnosis } from "../../model/diagnosis.model";
import { environment } from "../../../environments/environment";
import { Route } from "../../constants/route.constants";

@Injectable()
export class DiagnosisEffects {

  api = environment.api_url;
  nlm_url = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=";

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  createDiagnosis$ = createEffect(
    () => this.actions$.pipe(
      ofType(DiagnosisActions.createDiagnosis),
      switchMap(action => {
        this.loadingService.present("Creating Diagnosis...");

        return this.http.post(
          `${this.api}/diagnosis/diagnosis/`,
          action.diagnosis
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Diagnosis Created!", "Diagnosis created successfully");
            this.router.navigateByUrl(Route.DASHBOARD);
            return DiagnosisActions.clearState();
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failed!", "Diagnosis could not be created");
            return EMPTY;
          })
        )
      })
    )
  );

  updateDiagnosis$ = createEffect(
    () => this.actions$.pipe(
      ofType(DiagnosisActions.updateDiagnosis),
      switchMap(action => {
        this.loadingService.present("Updating Diagnosis...");

        const updatedDiagnosis = action.update.changes;

        return this.http.put(
          `${this.api}/diagnosis/diagnosis/${updatedDiagnosis.diagnosis_id}/`,
          { ...updatedDiagnosis }
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Diagnosis Updated!", "Diagnosis updated successfully");
            this.router.navigateByUrl(Route.DASHBOARD);
            return DiagnosisActions.clearState();
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failed!", "Diagnosis could not be updated");
            return EMPTY;
          })
        )
      })
    )
  );

  getDiagnosis$ = createEffect(
    () => this.actions$.pipe(
      ofType(DiagnosisActions.saveEncounterDetails),
      switchMap(action => {
        return this.http.get(`${this.api}/diagnosis/diagnosis?encounter_id=${action.encounter.encounter_id}`).pipe(
          map((responseData: Diagnosis[]) => {
            if (responseData.length) {
              return DiagnosisActions.getDiagnosis({ diagnosis: responseData[0] });
            } else {
              return { type: 'DUMMY' };
            }
          }),
          catchError(responseError => {
            // console.log(responseError);
            return EMPTY;
          })
        );
      })
    )
  );

  saveDiagnosis$ = createEffect(
    () => this.actions$.pipe(
      ofType(DiagnosisActions.saveEncounterDetails),
      tap(_ => this.router.navigateByUrl(Route.DIAGNOSIS))
    ),
    { dispatch: false }
  );

  searchICD$ = createEffect(
    () => this.actions$.pipe(
      ofType(DiagnosisActions.searchICD),
      switchMap(action => {
        this.loadingService.present("Searching");

        return this.http.get(`${this.nlm_url}${action.query}&maxList`).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            const results = responseData[3].map(codename => `${codename[0]}: ${codename[1]}`);
            return DiagnosisActions.icdFound({ results });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            return EMPTY;
          })
        );
      })
    )
  );


}