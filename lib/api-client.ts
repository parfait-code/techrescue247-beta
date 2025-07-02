// lib/api-client.ts

export class ApiClient {
    private baseURL = '/api';

    private getAuthToken(): string | null {
        // Essayer d'abord localStorage
        const token = localStorage.getItem('authToken');
        if (token) return token;

        // Si pas de token dans localStorage, essayer de récupérer depuis les cookies
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
        if (authCookie) {
            return authCookie.split('=')[1];
        }

        return null;
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

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            // Vérifier le Content-Type de la réponse
            const contentType = response.headers.get('content-type');

            if (!contentType || !contentType.includes('application/json')) {
                // Si on reçoit du HTML au lieu de JSON, c'est probablement une erreur
                const text = await response.text();
                console.error('Received non-JSON response:', text);

                if (response.status === 404) {
                    throw new Error(`Route API non trouvée: ${endpoint}`);
                }

                throw new Error('La réponse du serveur n\'est pas au format JSON');
            }

            if (response.status === 401) {
                // Token expiré ou invalide
                localStorage.removeItem('authToken');
                // Ne pas rediriger automatiquement, laisser l'application gérer
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    message: 'Une erreur est survenue',
                }));
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Méthodes pour chaque endpoint

    // Users
    async getUsers() {
        return this.request<any[]>('/users');
    }

    async getUser(id: string) {
        return this.request<any>(`/users/${id}`);
    }

    async updateUser(id: string, data: any) {
        return this.request(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteUser(id: string) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Tickets
    async getTickets() {
        return this.request<any[]>('/tickets');
    }

    async getTicket(id: string) {
        return this.request<any>(`/tickets/${id}`);
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

    async deleteTicket(id: string) {
        return this.request(`/tickets/${id}`, {
            method: 'DELETE',
        });
    }

    // Messages
    async getMessages() {
        return this.request<any[]>('/messages');
    }

    async getMessage(id: string) {
        return this.request<any>(`/messages/${id}`);
    }

    async createMessage(data: any) {
        return this.request('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateMessage(id: string, data: any) {
        return this.request(`/messages/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteMessage(id: string) {
        return this.request(`/messages/${id}`, {
            method: 'DELETE',
        });
    }

    // Auth
    async login(email: string, password: string) {
        return this.request<{ token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(data: any) {
        return this.request<{ token: string; user: any }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async verifyAuth() {
        return this.request<{ user: any }>('/auth/verify');
    }
}

// Instance singleton
export const apiClient = new ApiClient();

// Export pour compatibilité avec l'ancien code
export const api = apiClient;