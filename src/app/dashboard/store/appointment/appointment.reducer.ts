import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { AppointmentActions } from "./action-types";
import { Appointment } from "../../../model/appointment.model";
import { AuthActions } from "../../../auth/store/auth.action-types";

export interface AppointmentState extends EntityState<Appointment> {}

export const adapter = createEntityAdapter<Appointment>({
    // Since there is no id property within model, explicitly specify which
    // property to treat as the key
    selectId: (appointmentModel: Appointment) => appointmentModel.appointment_id,
});

export const initialAppointmentState = adapter.getInitialState();

export const appointmentReducer = createReducer(
  initialAppointmentState,

  on(AppointmentActions.allAppointmentsLoaded, (state, action) => {
    return adapter.setAll(
      action.appointments,
      {
        ...state,
      }
    )
  }),

  on(AppointmentActions.createAppointmentSuccess, (state, action) => {
    return adapter.addOne(
      { ...action.appointment },
      { ...state }
    )
  }),

  on(AppointmentActions.appointmentUpdatedSuccess, (state, action) => {
    return adapter.upsertOne(action.updated, state);
  }),

  on(AppointmentActions.convertToEncounterSuccess, (state, action) => {
    return adapter.upsertOne(action.appointment, state);
  }),

  on(AppointmentActions.cancelAppointmentSuccess, (state, action) => {
    return adapter.removeOne(action.appointment.appointment_id, state);
  }),

  on(AuthActions.logout, (state, action) => {
    return adapter.removeAll(state);
  })

)

export const { selectAll } = adapter.getSelectors();
