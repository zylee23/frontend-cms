import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { EncounterActions } from "./encounter-types";
import { Encounter } from "../../../model/encounter.model";
import { AuthActions } from "../../../auth/store/auth.action-types";
import { AppointmentActions } from "../appointment/action-types";

export interface EncounterState extends EntityState<Encounter> {}

export const adapter = createEntityAdapter<Encounter>({
    // Since there is no id property within model, explicitly specify which
    // property to treat as the key
    selectId: (encounterModel: Encounter) => encounterModel.encounter_id,
});

export const initialEncounterState = adapter.getInitialState();

export const encounterReducer = createReducer(
  initialEncounterState,

  on(EncounterActions.allEncountersLoaded, (state, action) => {
    return adapter.setAll(
      action.encounters,
      {
        ...state,
      }
    );
  }),

  on(EncounterActions.createEncounterSuccess, (state, action) => {
    return adapter.addOne(
      { ...action.encounter },
      { ...state }
    );
  }),

  on(AppointmentActions.convertToEncounterSuccess, (state, action) => {
    return adapter.addOne(
      { ...action.encounter },
      { ...state }
    );
  }),

  on(EncounterActions.encounterUpdatedSuccess, (state, action) => {
    return adapter.upsertOne(action.updated, state);
  }),

  on(EncounterActions.deleteEncounterSuccess, (state, action) => {
    return adapter.removeOne(action.encounterId, state);
  }),

  on(AuthActions.logout, (state, action) => {
    return adapter.removeAll(state);
  })
)

export const { selectAll } = adapter.getSelectors();
