// Utilitaires pour gérer l'authentification côté client avec des cookies

// Récupérer le token depuis les cookies
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        return token || null;
    }
    return null;
};

// Stocker le token dans un cookie (7 jours)
export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        document.cookie = `token=${token}; path=/; max-age=604800`; // 604800 = 7 jours en secondes
    }
};

// Supprimer le token
export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        document.cookie = 'token=; path=/; max-age=0';
    }
};

// Nettoyer toutes les données d'authentification
export const clearAuth = () => {
    removeAuthToken();
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

// Décoder le token JWT (sans vérification)
export const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

// Vérifier si le token est expiré
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

// Headers d'authentification pour les requêtes
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Récupérer les informations utilisateur depuis le token
export const getUserFromToken = () => {
    const token = getAuthToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
    };
};