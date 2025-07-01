// lib/api.ts

class ApiClient {
    private baseURL = '/api';

    private getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getAuthToken();

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };

        const response = await fetch(`${this.baseURL}${endpoint}`, config);

        if (response.status === 401) {
            // Token expiré ou invalide
            localStorage.removeItem('authToken');
            window.location.href = '/login';
            throw new Error('Session expirée');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'Une erreur est survenue',
            }));
            throw new Error(error.message);
        }

        return response.json();
    }

    // Méthodes pour chaque endpoint
    async getUsers() {
        return this.request<any[]>('/users');
    }

    async getTickets() {
        return this.request<any[]>('/tickets');
    }

    async createTicket(data: any) {
        return this.request('/tickets', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTicket(id: string, data: any) {
        return this.request(`/tickets/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async getMessages() {
        return this.request<any[]>('/messages');
    }

    async deleteMessage(id: string) {
        return this.request(`/messages/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient();