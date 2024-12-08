import api from './api';
import type { MedicalRecord } from '$lib/types';

const medicalRecordService = {
    async getMedicalRecords(patientId?: string) {
        const url = patientId ? `/medical-records?patient_id=${patientId}` : '/medical-records';
        const response = await api.get(url);
        
        // Map incoming data to MedicalRecord type
        return response.data.map((record: any) => ({
            id: record.id,
            patient_id: record.patient?.id || '',
            doctor_id: record.doctor?.id || '',
            record_number: record.record_number || '',
            status: record.status || 'Draft',
            chief_complaint: record.chief_complaint || '',
            subjective: record.subjective || '',
            objective: record.objective || '',
            assessment: record.assessment || '',
            plan: record.plan || '',
            diagnosis_codes: record.diagnosis_codes || [],
            medications: record.medications || [],
            allergies: record.allergies || [],
            attachments: record.attachments || [],
            created_at: record.created_at || new Date().toISOString(),
            updated_at: record.updated_at || new Date().toISOString(),
            created_by: record.created_by || '',
            updated_by: record.updated_by || '',
            patient: record.patient,
            doctor: record.doctor
        }));
    },

    async getMedicalRecord(id: string) {
        const response = await api.get(`/medical-records/${id}`);
        
        // Map incoming data to MedicalRecord type
        return {
            id: response.data.id,
            patient_id: response.data.patient?.id || '',
            doctor_id: response.data.doctor?.id || '',
            record_number: response.data.record_number || '',
            status: response.data.status || 'Draft',
            chief_complaint: response.data.chief_complaint || '',
            subjective: response.data.subjective || '',
            objective: response.data.objective || '',
            assessment: response.data.assessment || '',
            plan: response.data.plan || '',
            diagnosis_codes: response.data.diagnosis_codes || [],
            medications: response.data.medications || [],
            allergies: response.data.allergies || [],
            attachments: response.data.attachments || [],
            created_at: response.data.created_at || new Date().toISOString(),
            updated_at: response.data.updated_at || new Date().toISOString(),
            created_by: response.data.created_by || '',
            updated_by: response.data.updated_by || '',
            patient: response.data.patient,
            doctor: response.data.doctor
        };
    },

    async createMedicalRecord(data: FormData) {
        const response = await api.post('/medical-records', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        // Map incoming data to MedicalRecord type
        return {
            id: response.data.id,
            patient_id: response.data.patient?.id || '',
            doctor_id: response.data.doctor?.id || '',
            record_number: response.data.record_number || '',
            status: response.data.status || 'Draft',
            chief_complaint: response.data.chief_complaint || '',
            subjective: response.data.subjective || '',
            objective: response.data.objective || '',
            assessment: response.data.assessment || '',
            plan: response.data.plan || '',
            diagnosis_codes: response.data.diagnosis_codes || [],
            medications: response.data.medications || [],
            allergies: response.data.allergies || [],
            attachments: response.data.attachments || [],
            created_at: response.data.created_at || new Date().toISOString(),
            updated_at: response.data.updated_at || new Date().toISOString(),
            created_by: response.data.created_by || '',
            updated_by: response.data.updated_by || '',
            patient: response.data.patient,
            doctor: response.data.doctor
        };
    },

    async updateMedicalRecord(id: string, data: FormData) {
        const response = await api.put(`/medical-records/${id}`, data);
        
        // Map incoming data to MedicalRecord type
        return {
            id: response.data.id,
            patient_id: response.data.patient?.id || '',
            doctor_id: response.data.doctor?.id || '',
            record_number: response.data.record_number || '',
            status: response.data.status || 'Draft',
            chief_complaint: response.data.chief_complaint || '',
            subjective: response.data.subjective || '',
            objective: response.data.objective || '',
            assessment: response.data.assessment || '',
            plan: response.data.plan || '',
            diagnosis_codes: response.data.diagnosis_codes || [],
            medications: response.data.medications || [],
            allergies: response.data.allergies || [],
            attachments: response.data.attachments || [],
            created_at: response.data.created_at || new Date().toISOString(),
            updated_at: response.data.updated_at || new Date().toISOString(),
            created_by: response.data.created_by || '',
            updated_by: response.data.updated_by || '',
            patient: response.data.patient,
            doctor: response.data.doctor
        };
    },

    async deleteAttachment(recordId: string, attachmentUrl: string) {
        await api.delete(`/medical-records/${recordId}/attachments`, {
            data: { attachment_url: attachmentUrl }
        });
    },

    async deleteMedicalRecord(id: string) {
        await api.delete(`/medical-records/${id}`);
    }
};

export default medicalRecordService;
