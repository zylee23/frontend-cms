import { createAction, props } from '@ngrx/store';
import { CreateAdmin, CreateDoctor, CreatePatient, CreateClinic } from '../../model/create.model';
import { Doctor } from '../../model/doctor.model';
import { Patient } from '../../model/patient.model';
import { Clinic } from '../../model/clinic.model';

export const createAdmin = createAction(
  "[Create] Create Admin",
  props<{ admin: CreateAdmin }>()
);

export const createAdminSuccess = createAction(
  "[Create Success] Admin Created Successfully",
  props<{ admin: CreateAdmin }>()
);

export const createDoctor = createAction(
  "[Create] Create Doctor",
  props<{ doctor: CreateDoctor }>()
);

export const createDoctorSuccess = createAction(
  "[Create Success] Doctor Created Successfully",
  props<{ doctor: Doctor }>()
);

export const createClinic = createAction(
  "[Create] Create Clinic",
  props<{ clinic: CreateClinic }>()
);

export const createClinicSuccess = createAction(
  "[Create Success] Clinic Created Successfully",
  props<{ clinic: Clinic }>()
);

export const createPatient = createAction(
  "[Create] Create Patient",
  props<{ patient: CreatePatient }>()
);

export const createPatientSuccess = createAction(
  "[Create Success] Patient Created Successfully",
  props<{ patient: Patient }>()
);