import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DoctorState } from "./doctor.reducer";

import * as fromDoctors from "./doctor.reducer";

export const selectDoctorState = createFeatureSelector<DoctorState>("doctors")

export const selectAllDoctors = createSelector(
    selectDoctorState,
    fromDoctors.selectAll,
)
