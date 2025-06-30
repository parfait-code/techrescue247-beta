import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useFirebaseAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();
                    setToken(idToken);
                } catch (error) {
                    console.error('Error getting ID token:', error);
                    setToken(null);
                }
            } else {
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fonction pour rafraîchir le token
    const refreshToken = async () => {
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
    };

    // Fonction helper pour faire des requêtes authentifiées
    const authenticatedFetch = async (
        url: string,
        options: RequestInit = {}
    ): Promise<Response> => {
        const currentToken = token || (await refreshToken());

        if (!currentToken) {
            throw new Error('No authentication token available');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
        };

        return fetch(url, {
            ...options,
            headers,
        });
    };

    return {
        token,
        loading,
        refreshToken,
        authenticatedFetch,
    };
}