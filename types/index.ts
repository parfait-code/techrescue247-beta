export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface Ticket {
    _id: string;
    userId: string;
    user?: User;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    phone: string;
    screenshots: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}