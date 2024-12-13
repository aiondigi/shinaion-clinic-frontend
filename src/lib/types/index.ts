export type Gender = 'Male' | 'Female' | 'Other';
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export type MedicalRecordStatus = 'Draft' | 'Final' | 'Amended';
export type AttachmentType = 'Lab' | 'Imaging' | 'Prescription' | 'Other';

export interface Patient {
    id: string;
    full_name: string;
    date_of_birth: string;
    gender: Gender;
    contact_number?: string;
    email?: string;
    address?: string;
    insurance_id: string;
    created_at: string;
    updated_at: string;
}

export interface Doctor {
    id: string;
    full_name: string;
    specialization?: string;
    license_number: string;
    sip: string;
    contact_number?: string;
    email?: string;
    availability?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Appointment {
    id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    status: AppointmentStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
    patient?: Patient;
    doctor?: Doctor;
}

export interface Attachment {
    id: string;
    url: string;
    filename: string;
    type: AttachmentType;
    size: number;
    uploaded_at: string;
}

export interface Vitals {
    blood_pressure?: string;
    heart_rate?: number;
    respiratory_rate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    oxygen_saturation?: number;
}

export interface MedicalRecord {
	date: string | number | Date;
    id: string;
    patient_id: string;
    doctor_id: string;
    appointment_id?: string;
    record_number: string;
    status: MedicalRecordStatus;
    vitals?: Vitals;
    chief_complaint: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    diagnosis_codes: string[];
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
    allergies: string[];
    attachments: Attachment[];
    follow_up_date?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    patient?: Patient;
    doctor?: Doctor;
}
