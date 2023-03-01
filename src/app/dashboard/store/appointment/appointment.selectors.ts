import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppointmentState } from "./appointment.reducer";

import * as fromAppointments from "./appointment.reducer";

export const selectAppointmentState = createFeatureSelector<AppointmentState>("appointments")

export const selectAllAppointments = createSelector(
    selectAppointmentState,
    fromAppointments.selectAll,
)
