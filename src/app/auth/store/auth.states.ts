export interface AuthState {
  // profilePic: any;
  patient_id: number;   // store patient id if user is a patient
  clinic: number;   // store preferred clinic
  username: string;
  role: string;
  token: string;
}

export const initialAuthState: AuthState = {
  // profilePic: null,
  patient_id: null,
  clinic: null,
  username: null,
  role: null,
  token: null
};