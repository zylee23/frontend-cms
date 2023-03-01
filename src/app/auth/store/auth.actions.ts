import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
  "[Auth] User login",
  props<{ email: string, password: string }>()
);

export const authSuccess = createAction(
  "[Auth] User authentication success",
  props<{
    userData: {
      token: string,
      patient_id: number,
      clinic: number,
      username: string,
      role: string
    }
  }>()
);

export const authFail = createAction(
  "[Auth] User authentication fail"
);

export const autoLogin = createAction(
  "[Auth] Auto login"
);

export const logout = createAction(
  "[Auth] User logout"
);