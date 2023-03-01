export interface Create {
  name: string;
  dob?: Date;
  clinic?: number;
  address1: string;
  address2?: string;
  state: string;
  city: string,
  postcode: string;
  contactNumber: string;
  email?: string;
  password?: string;
}

export interface CreateAdmin {
  email: string,
  password: string,
  admin_info: {
    admin_name: string,
    admin_dob: Date,
    admin_address: string,
    admin_contact: string
    admin_clinic: number
  }
}

export interface CreateDoctor {
  email: string,
  password: string,
  doctor_info: {
    doctor_name: string,
    doctor_dob: Date,
    doctor_address: string,
    doctor_contact: string,
    doctor_clinic: number
  }
}

export interface CreatePatient {
  email: string,
  password: string,
  patient_info: {
    patient_name: string,
    patient_dob: Date,
    patient_address: string,
    patient_contact: string,
    patient_clinic: number
  }
}

export interface CreateClinic {
  clinic_name: string,
  clinic_address: string,
  clinic_contact: string
}

export function adminToJson(admin: Create): CreateAdmin {
  return {
    email: admin.email,
    password: admin.password,
    admin_info: {
      admin_name: admin.name,
      admin_dob: admin.dob,
      admin_address: `${admin.address1}, ${admin.address2 ? admin.address2 + ", " : ""}${admin.postcode} ${admin.city}, ${admin.state}`,
      admin_contact: admin.contactNumber,
      admin_clinic: +admin.clinic
    }
  };
}

export function doctorToJson(doctor: Create): CreateDoctor {
  return {
    email: doctor.email,
    password: doctor.password,
    doctor_info: {
      doctor_name: doctor.name,
      doctor_dob: doctor.dob,
      doctor_address: `${doctor.address1}, ${doctor.address2 ? doctor.address2 + ", " : ""}${doctor.postcode} ${doctor.city}, ${doctor.state}`,
      doctor_contact: doctor.contactNumber,
      doctor_clinic: +doctor.clinic
    }
  };
}

export function patientToJson(patient: Create): CreatePatient {
  return {
    email: patient.email,
    password: patient.password,
    patient_info: {
      patient_name: patient.name,
      patient_dob: patient.dob,
      patient_address: `${patient.address1}, ${patient.address2 ? patient.address2 + ", " : ""}${patient.postcode} ${patient.city}, ${patient.state}`,
      patient_contact: patient.contactNumber,
      patient_clinic: +patient.clinic
    }
  };
}

export function clinicToJson(clinic: Create): CreateClinic {
  return {
    clinic_name: clinic.name,
    clinic_address: `${clinic.address1}, ${clinic.address2 ? clinic.address2 + ", " : ""}${clinic.postcode} ${clinic.city}, ${clinic.state}`,
    clinic_contact: clinic.contactNumber
  };
}