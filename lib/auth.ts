import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Clé secrète JWT (à stocker dans les variables d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Types pour le payload JWT
export interface JWTPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
    iat?: number;
    exp?: number;
}

/**
 * Extraire le token depuis les headers de la requête
 * Supporte les formats : "Bearer token" ou juste "token"
 */
export function getTokenFromRequest(request: NextRequest): string | null {
    try {
        // Vérifier l'en-tête Authorization
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return null;
        }

        // Extraire le token du format "Bearer token"
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        return token || null;
    } catch (error) {
        console.error('Error extracting token:', error);
        return null;
    }
}

/**
 * Vérifier et décoder un token JWT
 * Retourne le payload si valide, null sinon
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        // Vérifier que les champs requis sont présents
        if (!decoded.userId || !decoded.email || !decoded.role) {
            console.error('Invalid token payload structure');
            return null;
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error('Invalid token');
        } else {
            console.error('Token verification error:', error);
        }
        return null;
    }
}

/**
 * Générer un nouveau token JWT
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token valide pendant 7 jours
    });
}

/**
 * Vérifier si un utilisateur a le rôle admin
 */
export function isAdmin(payload: JWTPayload | null): boolean {
    return payload?.role === 'admin';
}

/**
 * Middleware helper pour vérifier l'authentification
 */
export function requireAuth(request: NextRequest): JWTPayload | null {
    const token = getTokenFromRequest(request);
    if (!token) {
        return null;
    }

    return verifyToken(token);
}

/**
 * Middleware helper pour vérifier le rôle admin
 */
export function requireAdmin(request: NextRequest): JWTPayload | null {
    const payload = requireAuth(request);
    if (!payload || !isAdmin(payload)) {
        return null;
    }

    return payload;
}