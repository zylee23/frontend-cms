import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { Encounter } from "src/app/model/encounter.model";
import { Appointment } from "../../../model/appointment.model";

export const loadAllAppointments = createAction(
  "[Appointments Resolver] Load All Appointments",
);

export const allAppointmentsLoaded = createAction(
  "[Load Appointments Effect] All Appointments Loaded",
  props<{appointments: Appointment[]}>(),
);

export const createAppointment = createAction(
  "[Create Appointment] Create Appointment",
  props<{ appointment: Appointment }>()
);

export const createAppointmentSuccess = createAction(
  "[Create Appointment Success] Appointment Created Successfully",
  props<{ appointment: Appointment }>()
);

export const appointmentUpdated = createAction(
  "[Edit Appointment Dialog] Appointment Updated",
  props<{update: Update<Appointment>}>(),
);

export const appointmentUpdatedSuccess = createAction(
  "[Edit Appointment Success] Appointment Updated Successfully",
  props<{ updated: Appointment }>(),
);

export const cancelAppointment = createAction(
  "[Cancel Appointment] Cancel Appointment",
  props<{ appointment: Update<Appointment> }>()
);

export const cancelAppointmentSuccess = createAction(
  "[Cancel Appointment Success] Appointment Cancelled Successfully",
  props<{ appointment: Appointment }>()
);

export const convertToEncounter = createAction(
  "[Convert] Convert Appointment to Encounter",
  props<{ appointment: Update<Appointment>, encounter: Encounter }>()
);

export const convertToEncounterSuccess = createAction(
  "[Convert Success] Appointment Converted to Encounter",
  props<{ appointment: Appointment, encounter: Encounter }>()
);