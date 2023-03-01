import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ModalController } from "@ionic/angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { LoadingService } from "../../../shared/loading.service";
import { AlertService } from "../../../shared/alert.service";
import { Encounter } from "../../../model/encounter.model";
import { EncounterActions } from "./encounter-types";
import { environment } from "../../../../environments/environment";

@Injectable()
export class EncounterEffects {

  api = environment.api_url;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private modalCtrl: ModalController
  ) {}

  loadAllEncounters$ = createEffect(
    () => this.actions$.pipe(
      ofType(EncounterActions.loadAllEncounters),
      switchMap(_ => {
        return this.http.get<Encounter[]>(`${this.api}/encounter/encounters/`).pipe(
          map(responseData => {
            return EncounterActions.allEncountersLoaded({ encounters: responseData });
          }),
          catchError(responseError => {
            return EMPTY;
          })
        );
      })
    )
  );

  createEncounter$ = createEffect(
    () => this.actions$.pipe(
      ofType(EncounterActions.createEncounter),
      switchMap((action) => {
        this.loadingService.present("Creating Encounter...")

        return this.http.post<Encounter>(
          `${this.api}/encounter/encounters/`,
          action.encounter
        ).pipe(
          map(responseData => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Encounter Created!", "Encounter created successfully");
            return EncounterActions.createEncounterSuccess({ encounter: responseData });
          }),
          catchError(responseError => {
            this.loadingService.dismiss();
            this.alertService.createAlert("Failed!", "Encounter could not be created");
            return EMPTY;
          })
        )
      })
    )
    // { dispatch: false }
  );

  updateEncounter$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(EncounterActions.encounterUpdated),
        switchMap((action) => {
          const updatedEncounter = action.update.changes;

          const encounterId = updatedEncounter.encounter_id;
          const body = {
            ...updatedEncounter
          };

          // return this.http.put(
          //   `${URL}/encounter/encounters/${encounterId}/`,
          //   body
          // );
          return this.http.put<Encounter>(
            `${this.api}/encounter/encounters/${encounterId}/`,
            body,
          ).pipe(
            map(responseData => {
              this.loadingService.dismiss();
              this.alertService.createAlert("Encounter Updated!", "Encounter updated successfully");
              return EncounterActions.encounterUpdatedSuccess({ updated: responseData
              });
            }),
            catchError(responseError => {
              this.loadingService.dismiss();
              this.alertService.createAlert("Failed!", "Encounter could not be updated");
              return EMPTY;
            })
          );
        }),
      )
  );

  deleteEncounter$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(EncounterActions.deleteEncounter),
        switchMap(action => {
          this.loadingService.present("Deleting Encounter...");

          return this.http.delete(
            `${this.api}/encounter/encounters/${action.encounterId}/`
          ).pipe(
            map(responseData => {
              this.modalCtrl.dismiss(action.encounterId);
              this.loadingService.dismiss();
              this.alertService.createAlert("Encounter Deleted!", "Encounter deleted successfully");
              return EncounterActions.deleteEncounterSuccess({ encounterId: action.encounterId });
            }),
            catchError(responseError => {
              this.loadingService.dismiss();
              this.alertService.createAlert("Failed!", "Encounter could not be deleted");
              return EMPTY;
            })
          );
        }),
      ),
    { dispatch: false }
  );

}
