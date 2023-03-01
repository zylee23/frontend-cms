import { createAction, props } from "@ngrx/store";
import { Doctor } from "../../../model/doctor.model";

export const loadAllDoctors = createAction(
    "[Doctors Resolver] Load All Doctors",
);

export const allDoctorsLoaded = createAction(
    "[Load Doctors Effect] All Doctors Loaded",
    props<{doctors: Doctor[]}>(),
);
