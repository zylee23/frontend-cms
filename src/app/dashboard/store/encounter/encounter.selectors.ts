import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EncounterState } from "./encounter.reducer";

import * as fromEncounters from "./encounter.reducer";

export const selectEncounterState = createFeatureSelector<EncounterState>("encounters")

export const selectAllEncounters = createSelector(
    selectEncounterState,
    fromEncounters.selectAll,
)
