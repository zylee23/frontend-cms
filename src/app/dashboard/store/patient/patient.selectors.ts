import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PatientState } from "./patient.reducer";

import * as fromPatients from "./patient.reducer";

export const selectPatientState = createFeatureSelector<PatientState>("patients")

export const selectAllPatients = createSelector(
    selectPatientState,
    fromPatients.selectAll,
);