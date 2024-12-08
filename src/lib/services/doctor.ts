import api from './api';
import type { Doctor } from '$lib/types';

const doctorService = {
    async getDoctors() {
        const response = await api.get('/doctors');
        return response.data;
    },

    async getDoctor(id: string) {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    },

    async createDoctor(data: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/doctors', data);
        return response.data;
    },

    async updateDoctor(id: string, data: Partial<Doctor>) {
        const response = await api.put(`/doctors/${id}`, data);
        return response.data;
    },

    async deleteDoctor(id: string) {
        await api.delete(`/doctors/${id}`);
    }
};

export default doctorService;
