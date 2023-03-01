import { createReducer, on } from "@ngrx/store";
import { AuthActions } from './auth.action-types';
import { initialAuthState } from './auth.states';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.authSuccess, (state, action) => {
    return {
      ...state,
      token: action.userData.token,
      patient_id: action.userData.patient_id,
      clinic: action.userData.clinic,
      username: action.userData.username,
      role: action.userData.role
    }
  }),

  on(AuthActions.logout, (state, action) => {
    return {
      ...state,
      token: null,
      patient_id: null,
      clinic: null,
      username: null,
      role: null
    }
  })

);