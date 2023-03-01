import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { Clinic } from "src/app/model/clinic.model";

export const loadAllClinics = createAction(
    "[Clinics Resolver] Load All Clinics",
);

export const allClinicsLoaded = createAction(
    "[Load Clinics Effect] All Clinics Loaded",
    props<{clinics: Clinic[]}>(),
);
