import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { Encounter } from "../../model/encounter.model";
import { Diagnosis } from "../../model/diagnosis.model";

export const saveEncounterDetails = createAction(
  "[Go To Diagnosis] Encounter Details",
  props<{ encounter: Encounter }>(),
);

export const createDiagnosis = createAction(
  "[Create Diagnosis] Create Diagnosis",
  props<{ diagnosis: Diagnosis }>(),
);

export const updateDiagnosis = createAction(
  "[Diagnosis] Update Diagnosis",
  props<{ update: Update<Diagnosis> }>(),
);

export const getDiagnosis = createAction(
  "[Diagnosis] Get Diagnosis",
  props<{ diagnosis: Diagnosis }>(),
);

export const searchICD = createAction(
  "[Diagnosis] Search ICD",
  props<{ query: string }>(),
);

export const icdFound = createAction(
  "[Diagnosis] ICD QUery Results",
  props<{ results: string[] }>(),
);

export const clearState = createAction(
  "[Diagnosis] Clear Diagnosis State"
);