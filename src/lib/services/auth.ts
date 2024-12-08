import { goto } from '$app/navigation';
import { mockUsers } from './mockData';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    full_name: string;
}

const authService = {
    async login(data: LoginData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const token = btoa(JSON.stringify(user)); // Base64 encode user data as mock token
        localStorage.setItem('token', token);
        await goto('/dashboard');
        return { token, user };
    },

    async register(data: RegisterData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (mockUsers.some(u => u.email === data.email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: mockUsers.length + 1,
            ...data,
            role: 'USER'
        };
        mockUsers.push(newUser);
        return newUser;
    },

    async logout() {
        localStorage.removeItem('token');
        await goto('/login');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;
        try {
            return JSON.parse(atob(token));
        } catch {
            return null;
        }
    }
};

export default authService;
