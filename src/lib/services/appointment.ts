import api from './api';
import type { Appointment } from '$lib/types';
import { format } from 'date-fns';

const appointmentService = {
    async getAppointments(startDate?: Date, endDate?: Date) {
        const params = new URLSearchParams();
        if (startDate) {
            params.append('start_date', format(startDate, 'yyyy-MM-dd'));
        }
        if (endDate) {
            params.append('end_date', format(endDate, 'yyyy-MM-dd'));
        }
        const query = params.toString();
        const response = await api.get(`/appointments${query ? `?${query}` : ''}`);
        return response.data;
    },

    async getAppointment(id: string) {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    async createAppointment(data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    async updateAppointment(id: string, data: Partial<Appointment>) {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    },

    async deleteAppointment(id: string) {
        await api.delete(`/appointments/${id}`);
    },

    async getDoctorAvailableSlots(doctorId: string, date: Date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await api.get(`/doctors/${doctorId}/available-slots?date=${formattedDate}`);
        return response.data;
    }
};

export default appointmentService;
