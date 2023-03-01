import { createAction, props } from "@ngrx/store";
import { Patient } from "../../../model/patient.model";

export const loadAllPatients = createAction(
  "[Patient] Load All Patients",
);

export const allPatientsLoaded = createAction(
    "[Load Patients Effect] All Patients Loaded",
    props<{ patients: Patient[] }>(),
);
