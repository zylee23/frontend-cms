export interface Encounter {
    encounter_id?: number,
    encounter_date: string,
    encounter_time: string,
    encounter_appointment?: number,
    encounter_created_by?: number,
    encounter_patient: any,
    encounter_doctor: any,
    encounter_clinic: any,
    encounter_comments: string
}
