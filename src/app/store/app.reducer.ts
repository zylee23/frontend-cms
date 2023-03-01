import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from '../auth/store/auth.states';
import { authReducer } from '../auth/store/auth.reducers';
import { appointmentReducer, AppointmentState } from '../dashboard/store/appointment/appointment.reducer';
import { encounterReducer, EncounterState } from '../dashboard/store/encounter/encounter.reducer';
import { doctorReducer, DoctorState } from '../dashboard/store/doctor/doctor.reducer';
import { clinicReducer, ClinicState } from '../dashboard/store/clinic/clinic.reducer';
import { patientReducer, PatientState } from '../dashboard/store/patient/patient.reducer';
import { diagnosisReducer, DiagnosisState } from '../diagnosis/store/diagnosis.reducer';

export interface AppState {
  auth: AuthState
  appointments: AppointmentState,
  encounters: EncounterState,
  doctors: DoctorState,
  clinics: ClinicState,
  patients: PatientState,
  diagnosis: DiagnosisState
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  appointments: appointmentReducer,
  encounters: encounterReducer,
  doctors: doctorReducer,
  clinics: clinicReducer,
  patients: patientReducer,
  diagnosis: diagnosisReducer
};
