import { mockAppointments, mockDashboardStats } from './mockData';

const mockApi = {
    async get(url: string): Promise<{ data: any }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        switch (url) {
            case '/appointments/today':
                return {
                    data: mockAppointments.filter(a => {
                        const appointmentDate = new Date(a.appointment_date);
                        const today = new Date();
                        return appointmentDate.toDateString() === today.toDateString();
                    })
                };
            case '/dashboard/stats':
                return { data: mockDashboardStats };
            default:
                throw new Error('Not implemented');
        }
    },

    async post(url: string, data: any, config?: { headers?: Record<string, string> }): Promise<{ data: any }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        switch (url) {
            default:
                throw new Error('Not implemented');
        }
    },

    async put(url: string, data: any): Promise<{ data: any }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        switch (url) {
            case url.match(/^\/patients\/\d+$/)?.input:
                // Simulate successful update
                return { data: { ...data, id: url.split('/').pop() } };
            default:
                throw new Error('Not implemented');
        }
    },

    async delete(url: string, config?: { data?: any }): Promise<{ data: any }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        switch (url) {
            case url.match(/^\/patients\/\d+$/)?.input:
                // Simulate successful deletion
                return { data: { message: 'Patient deleted successfully' } };
            default:
                throw new Error('Not implemented');
        }
    }
};

export default mockApi;
