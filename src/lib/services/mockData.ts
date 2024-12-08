// src/lib/services/mockData.ts

export const mockUsers = [
    {
        id: 1,
        email: 'admin@example.com',
        password: 'admin123',
        full_name: 'Admin User',
        role: 'ADMIN'
    }
];

export const mockDoctors = [
    {
        id: 1,
        full_name: 'Dr. John Smith',
        specialization: 'General Practice',
        email: 'john.smith@example.com'
    },
    {
        id: 2,
        full_name: 'Dr. Sarah Johnson',
        specialization: 'Pediatrics',
        email: 'sarah.johnson@example.com'
    }
];

export const mockPatients = [
    {
        id: 1,
        full_name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '123-456-7890'
    },
    {
        id: 2,
        full_name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '098-765-4321'
    }
];

export const mockAppointments = [
    {
        id: 1,
        patient: mockPatients[0],
        doctor: mockDoctors[0],
        appointment_date: new Date().toISOString(),
        status: 'SCHEDULED',
        notes: 'Regular checkup'
    },
    {
        id: 2,
        patient: mockPatients[1],
        doctor: mockDoctors[1],
        appointment_date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        status: 'CONFIRMED',
        notes: 'Follow-up appointment'
    }
];

export const mockDashboardStats = {
    totalPatients: mockPatients.length,
    totalDoctors: mockDoctors.length,
    totalAppointments: mockAppointments.length,
    upcomingAppointments: mockAppointments.filter(a => new Date(a.appointment_date) > new Date()).length
};
