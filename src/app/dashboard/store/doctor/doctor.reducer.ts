import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Doctor } from "../../../model/doctor.model";
import { DoctorActions } from "./doctor-types";
import { CreateActions } from "../../../create/store/create.action-types";
import { AuthActions } from "../../../auth/store/auth.action-types";

export interface DoctorState extends EntityState<Doctor> {}

export const adapter = createEntityAdapter<Doctor>({
  // Since there is no id property within model, explicitly specify which
  // property to treat as the key
  selectId: (doctorModel: Doctor) => doctorModel.doctor_id,
});

export const initialDoctorState = adapter.getInitialState();

export const doctorReducer = createReducer(
  initialDoctorState,

  on(DoctorActions.allDoctorsLoaded, (state, action) => {
    return adapter.setAll(
      action.doctors,
      {
        ...state,
      }
    )
  }),

  on(CreateActions.createDoctorSuccess, (state, action) => {
    return adapter.addOne(
      { ...action.doctor},
      { ...state }
    )
  }),

  on(AuthActions.logout, (state, action) => {
    return adapter.removeAll(state);
  })
)

export const { selectAll } = adapter.getSelectors();
