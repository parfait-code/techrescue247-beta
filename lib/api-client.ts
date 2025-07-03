// 2. CORRECTION DU CLIENT API (lib/api-client.ts)
export class ApiClient {
    private baseURL = '/api';

    private getAuthToken(): string | null {
        // Vérifier d'abord si on est côté client
        if (typeof window === 'undefined') {
            return null;
        }

        // Essayer localStorage
        try {
            const token = localStorage.getItem('authToken');
            if (token) return token;
        } catch (error) {
            console.warn('localStorage non disponible');
        }

        // Essayer les cookies
        try {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(cookie =>
                cookie.trim().startsWith('authToken=')
            );
            if (authCookie) {
                return decodeURIComponent(authCookie.split('=')[1]);
            }
        } catch (error) {
            console.warn('Erreur lecture cookies');
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
                // Toujours inclure le token s'il existe
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            // Debug : afficher les headers de la requête
            console.log('Request headers:', config.headers);
            console.log('Response status:', response.status);

            const contentType = response.headers.get('content-type');

            if (response.status === 401) {
                // Token expiré ou invalide
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('authToken');
                    // Supprimer aussi le cookie
                    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                }
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }

            if (!response.ok) {
                let errorMessage = `Erreur HTTP: ${response.status}`;

                try {
                    if (contentType?.includes('application/json')) {
                        const error = await response.json();
                        errorMessage = error.message || errorMessage;
                    } else {
                        const text = await response.text();
                        console.error('Non-JSON response:', text);
                        errorMessage = 'Erreur de format de réponse';
                    }
                } catch (parseError) {
                    console.error('Erreur parsing réponse:', parseError);
                }

                throw new Error(errorMessage);
            }

            if (!contentType?.includes('application/json')) {
                const text = await response.text();
                console.error('Réponse non-JSON:', text);
                throw new Error('Format de réponse invalide');
            }

            return response.json();
        } catch (error) {
            console.error('Erreur requête API:', error);
            throw error;
        }
    }

    // Méthode pour sauvegarder le token après login
    async login(email: string, password: string) {
        const result = await this.request<{ token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        // Sauvegarder le token
        if (typeof window !== 'undefined' && result.token) {
            localStorage.setItem('authToken', result.token);
            // Optionnel : aussi dans les cookies pour le middleware
            document.cookie = `authToken=${result.token}; path=/; max-age=86400`; // 24h
        }

        return result;
    }

    // Méthode pour vérifier l'authentification
    async verifyAuth() {
        return this.request<{ user: any }>('/auth/verify');
    }

    // Méthode pour se déconnecter
    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }

    // Reste des méthodes...
    async getUsers() {
        return this.request<any[]>('/users');
    }

    async getTickets() {
        return this.request<any[]>('/tickets');
    }

    // etc...
}

export const apiClient = new ApiClient();
export const api = apiClient;

// 3. FONCTION DE DEBUG POUR TESTER L'AUTH
export const debugAuth = () => {
    if (typeof window === 'undefined') {
        console.log('Côté serveur - pas de localStorage');
        return;
    }

    const localToken = localStorage.getItem('authToken');
    const cookies = document.cookie;

    console.log('=== DEBUG AUTH ===');
    console.log('Token localStorage:', localToken ? 'Présent' : 'Absent');
    console.log('Cookies:', cookies);
    console.log('Headers qui seront envoyés:', {
        'Content-Type': 'application/json',
        ...(localToken && { Authorization: `Bearer ${localToken}` })
    });
    console.log('==================');
};