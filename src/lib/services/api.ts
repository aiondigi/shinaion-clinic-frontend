import { mockAppointments, mockDashboardStats, mockDoctors, mockUsers } from './mockData';

// Mock data for medical records and patients
const mockPatients = [
    {
        id: '1',
        full_name: 'John Doe',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        contact_number: '123-456-7890',
        email: 'john.doe@example.com'
    },
    {
        id: '2',
        full_name: 'Jane Smith',
        date_of_birth: '1985-05-15',
        gender: 'Female',
        contact_number: '098-765-4321',
        email: 'jane.smith@example.com'
    }
];

const mockMedicalRecords = [
    {
        id: '1',
        patient_id: '1',
        doctor_id: '1',
        record_number: 'MR001',
        status: 'Completed',
        chief_complaint: 'Headache',
        subjective: 'Patient reports severe headache',
        objective: 'No visible trauma',
        assessment: 'Migraine',
        plan: 'Prescribed pain medication',
        diagnosis_codes: ['G43.9'],
        created_at: '2023-12-01T00:00:00Z'
    }
];

const mockApi = {
    async get(url: string): Promise<{ data: any }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (url.startsWith('/medical-records')) {
            const patientId = url.includes('?') ? new URLSearchParams(url.split('?')[1]).get('patient_id') : null;
            return {
                data: patientId 
                    ? mockMedicalRecords.filter(record => record.patient_id === patientId)
                    : mockMedicalRecords
            };
        }

        switch (url) {
            case '/appointments/today':
                return {
                    data: mockAppointments.filter(a => {
                        const appointmentDate = new Date(a.appointment_date);
                        const today = new Date();
                        return appointmentDate.toDateString() === today.toDateString();
                    })
                };
            case '/appointments':
                return { data: mockAppointments };
            case '/dashboard/stats':
                return { data: mockDashboardStats };
            case '/patients':
                return { data: mockPatients };
            case '/doctors':
                return { data: mockDoctors };
            default:
                throw new Error(`Endpoint not implemented: ${url}`);
        }
    },

    async post(url: string, data: any, config?: { headers?: Record<string, string> }): Promise<{ data: any }> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        switch (url) {
            case '/medical-records':
                const newRecord = {
                    id: (mockMedicalRecords.length + 1).toString(),
                    ...data,
                    created_at: new Date().toISOString()
                };
                mockMedicalRecords.push(newRecord);
                return { data: newRecord };
            case '/patients':
                const newPatient = {
                    id: (mockPatients.length + 1).toString(),
                    ...data
                };
                mockPatients.push(newPatient);
                return { data: newPatient };
            default:
                throw new Error(`Endpoint not implemented: ${url}`);
        }
    },

    async put(url: string, data: any): Promise<{ data: any }> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const [, resource, id] = url.split('/');
        
        switch (resource) {
            case 'medical-records':
                const recordIndex = mockMedicalRecords.findIndex(r => r.id === id);
                if (recordIndex === -1) throw new Error('Record not found');
                mockMedicalRecords[recordIndex] = { ...mockMedicalRecords[recordIndex], ...data };
                return { data: mockMedicalRecords[recordIndex] };
            case 'patients':
                const patientIndex = mockPatients.findIndex(p => p.id === id);
                if (patientIndex === -1) throw new Error('Patient not found');
                mockPatients[patientIndex] = { ...mockPatients[patientIndex], ...data };
                return { data: mockPatients[patientIndex] };
            default:
                throw new Error(`Endpoint not implemented: ${url}`);
        }
    },

    async delete(url: string, config?: { data?: any }): Promise<{ data: any }> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const [, resource, id] = url.split('/');
        
        switch (resource) {
            case 'medical-records':
                const recordIndex = mockMedicalRecords.findIndex(r => r.id === id);
                if (recordIndex === -1) throw new Error('Record not found');
                mockMedicalRecords.splice(recordIndex, 1);
                return { data: { success: true } };
            case 'patients':
                const patientIndex = mockPatients.findIndex(p => p.id === id);
                if (patientIndex === -1) throw new Error('Patient not found');
                mockPatients.splice(patientIndex, 1);
                return { data: { success: true } };
            default:
                throw new Error(`Endpoint not implemented: ${url}`);
        }
    }
};

export default mockApi;
