import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.states';

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectRole = createSelector(
    selectAuthState,
    auth => auth.role
);

export const selectPatientId = createSelector(
    selectAuthState,
    auth => auth.patient_id
);

export const isAuthenticated = createSelector(
    selectAuthState,
    auth => !!auth.token
);