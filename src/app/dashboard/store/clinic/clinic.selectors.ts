import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ClinicState } from "./clinic.reducer";

import * as fromClinics from "./clinic.reducer";

export const selectClinicState = createFeatureSelector<ClinicState>("clinics")

export const selectAllClinics = createSelector(
    selectClinicState,
    fromClinics.selectAll,
)
