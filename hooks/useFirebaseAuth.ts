import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

export function useFirebaseAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();
                    setToken(idToken);
                    setFirebaseUser(user);

                    // Synchroniser avec Redux si nécessaire
                    dispatch(checkAuth());
                } catch (error) {
                    console.error('Error getting ID token:', error);
                    setToken(null);
                    setFirebaseUser(null);
                }
            } else {
                setToken(null);
                setFirebaseUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    // Fonction pour rafraîchir le token
    const refreshToken = useCallback(async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const idToken = await user.getIdToken(true);
                setToken(idToken);
                return idToken;
            } catch (error) {
                console.error('Error refreshing token:', error);
                return null;
            }
        }
        return null;
    }, []);

    // Fonction helper pour faire des requêtes authentifiées
    const authenticatedFetch = useCallback(async (
        url: string,
        options: RequestInit = {}
    ): Promise<Response> => {
        let currentToken = token;

        // Si pas de token ou si la requête échoue avec 401, rafraîchir le token
        if (!currentToken) {
            currentToken = await refreshToken();
        }

        if (!currentToken) {
            throw new Error('No authentication token available');
        }

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Si 401, essayer de rafraîchir le token et refaire la requête
        if (response.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
                return fetch(url, {
                    ...options,
                    headers: {
                        ...headers,
                        'Authorization': `Bearer ${newToken}`,
                    },
                });
            }
        }

        return response;
    }, [token, refreshToken]);

    // Fonction helper pour les requêtes API typiques
    const apiRequest = useCallback(async <T = any>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> => {
        const response = await authenticatedFetch(url, options);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }, [authenticatedFetch]);

    return {
        token,
        firebaseUser,
        loading,
        refreshToken,
        authenticatedFetch,
        apiRequest,
    };
}