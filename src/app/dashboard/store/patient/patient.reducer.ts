import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Patient } from "../../../model/patient.model";
import { PatientActions } from "./patient-types";
import { CreateActions } from "../../../create/store/create.action-types";
import { AuthActions } from "../../../auth/store/auth.action-types";

export interface PatientState extends EntityState<Patient> {}

export const adapter = createEntityAdapter<Patient>({
    selectId: (patientModel: Patient) => patientModel.patient_id,
});

export const initialPatientState = adapter.getInitialState();

export const patientReducer = createReducer(
  initialPatientState,

  on(PatientActions.allPatientsLoaded, (state, action) => {
    return adapter.setAll(
      action.patients,
      {
        ...state,
      }
    )
  }),

  on(CreateActions.createPatientSuccess, (state, action) => {
    return adapter.addOne(
      { ...action.patient },
      { ...state }
    )
  }),

  on(AuthActions.logout, (state, action) => {
    return adapter.removeAll(state);
  })
)

export const { selectAll } = adapter.getSelectors();
