import { createReducer, on } from "@ngrx/store";
import { Encounter } from "../../model/encounter.model";
import { Diagnosis } from "../../model/diagnosis.model";
import { DiagnosisActions } from "./diagnosis.action-types";

export interface DiagnosisState {
  currentEncounter: Encounter,
  diagnosis: Diagnosis,
  icdResults: string[]
}

const initialDiagnosisState: DiagnosisState = {
  currentEncounter: null,
  diagnosis: null,
  icdResults: null
};

export const diagnosisReducer = createReducer(
  initialDiagnosisState,

  // on(DiagnosisActions.createDiagnosis, (state, action) => {
  //   return {
  //     ...state,
  //     currentEncounter: null,
  //     icdResults: null
  //   }
  // }),

  on(DiagnosisActions.getDiagnosis, (state, action) => {
    return {
      ...state,
      diagnosis: action.diagnosis
    }
  }),

  on(DiagnosisActions.saveEncounterDetails, (state, action) => {
    return {
      ...state,
      currentEncounter: action.encounter
    }
  }),

  on(DiagnosisActions.icdFound, (state, action) => {
    return {
      ...state,
      icdResults: action.results
    }
  }),

  on(DiagnosisActions.clearState, (state, action) => {
    return {
      ...state,
      currentEncounter: null,
      diagnosis: null,
      icdResults: null
    }
  }),

);