import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Clinic } from "../../../model/clinic.model";
import { ClinicActions } from "./clinic-types";
import { CreateActions } from "../../../create/store/create.action-types";
import { AuthActions } from "../../../auth/store/auth.action-types";

export interface ClinicState extends EntityState<Clinic> {}

export const adapter = createEntityAdapter<Clinic>({
	// Since there is no id property within model, explicitly specify which
	// property to treat as the key
	selectId: (clinicModel: Clinic) => clinicModel.clinic_id,
});

export const initialClinicState = adapter.getInitialState();

export const clinicReducer = createReducer(
	initialClinicState,

	on(ClinicActions.allClinicsLoaded, (state, action) => {
		return adapter.setAll(
			action.clinics,
			{
				...state,
			}
		)
	}),

	on(CreateActions.createClinicSuccess, (state, action) => {
		return adapter.addOne(
			{ ...action.clinic },
			{ ...state }
		)
	}),

	on(AuthActions.logout, (state, action) => {
		return adapter.removeAll(state);
	})
)

export const { selectAll } = adapter.getSelectors();
