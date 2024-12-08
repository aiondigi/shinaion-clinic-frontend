import api from './api';
import type { Patient } from '$lib/types';

// Type guard to check if the response data matches our Patient type
function isPatient(data: any): data is Patient {
    return (
        data &&
        typeof data.id === 'string' &&
        typeof data.full_name === 'string'
    );
}

const patientService = {
    async getPatients(): Promise<Patient[]> {
        const response = await api.get('/patients');
        if (!response.data || !Array.isArray(response.data)) {
            return [];
        }
        return response.data.filter(isPatient);
    },

    async getPatient(id: string): Promise<Patient | null> {
        try {
            const response = await api.get(`/patients/${id}`);
            return isPatient(response.data) ? response.data : null;
        } catch (error) {
            console.error('Error fetching patient:', error);
            return null;
        }
    },

    async createPatient(data: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient | null> {
        try {
            const response = await api.post('/patients', data);
            return isPatient(response.data) ? response.data : null;
        } catch (error) {
            console.error('Error creating patient:', error);
            return null;
        }
    },

    async updatePatient(id: string, data: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>): Promise<Patient | null> {
        try {
            const response = await api.put(`/patients/${id}`, data);
            return isPatient(response.data) ? response.data : null;
        } catch (error) {
            console.error('Error updating patient:', error);
            return null;
        }
    },

    async deletePatient(id: string): Promise<void> {
        await api.delete(`/patients/${id}`);
    }
};

export default patientService;
