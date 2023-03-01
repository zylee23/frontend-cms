export interface Appointment {
    appointment_id?: number,
    appointment_date: string,
    appointment_time: string,
    appointment_status: string,
    appointment_patient: any,
    appointment_doctor: any,
    appointment_clinic: any,
    appointment_comments: string,
    created_by?: number,
}
