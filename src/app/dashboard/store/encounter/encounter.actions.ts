import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { Encounter } from "../../../model/encounter.model";

export const loadAllEncounters = createAction(
	"[Encounters Resolver] Load All Encounters",
);

export const allEncountersLoaded = createAction(
	"[Load Encounters Effect] All Encounters Loaded",
	props<{encounters: Encounter[]}>(),
);

export const createEncounter = createAction(
	"[Create Encounter] Create Encounter",
	props<{ encounter: Encounter }>()
);

export const createEncounterSuccess = createAction(
	"[Create Encounter Success] Encounter Created Successfully",
	props<{ encounter: Encounter }>()
);

export const encounterUpdated = createAction(
	"[Edit Encounter Dialog] Encounter Updated",
	props<{update: Update<Encounter>}>(),
);

export const encounterUpdatedSuccess = createAction(
	"[Edit Encounter Success] Encounter Updated Successfully",
	props<{ updated: Encounter }>(),
);

export const deleteEncounter = createAction(
	"[Delete Encounter Dialog] Delete Encounter",
	props<{encounterId: number}>(),
);

export const deleteEncounterSuccess = createAction(
	"[Delete Encounter Success] Encounter Deleted Successfully",
	props<{ encounterId: number }>()
);
