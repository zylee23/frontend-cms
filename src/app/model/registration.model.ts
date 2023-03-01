export interface UserRegistration {
    name: string;
    dob: Date;
    clinic: number;
    address1: string;
    address2?: string;
    state: string;
    city: string;
    postcode: string;
    contactNumber: number;
    email: string;
    newPassword: string;
    reNewPassword: string;
}

export function toJson(userRegistration: UserRegistration) {
    return {
        email: userRegistration.email,
        password: userRegistration.newPassword,
        patient_info: {
            patient_name: userRegistration.name,
            patient_dob: userRegistration.dob,
            patient_address: `${userRegistration.address1}, ${userRegistration.address2 ? userRegistration.address2 + "," : ""} ${userRegistration.postcode} ${userRegistration.city} ${userRegistration.state}`,
            patient_contact: userRegistration.contactNumber,
            patient_clinic: +userRegistration.clinic
        }
    }
}
