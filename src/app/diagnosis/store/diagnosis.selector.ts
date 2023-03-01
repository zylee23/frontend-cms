import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiagnosisState } from './diagnosis.reducer';

export const selectDiagnosisState = createFeatureSelector<DiagnosisState>("diagnosis");

export const selectCurrentEncounter = createSelector(
    selectDiagnosisState,
    diagnosis => diagnosis.currentEncounter
);

export const selectDiagnosis = createSelector(
    selectDiagnosisState,
    diagnosis => diagnosis.diagnosis
);

export const selectICDResults = createSelector(
    selectDiagnosisState,
    diagnosis => diagnosis.icdResults
);