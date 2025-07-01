// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MessagesService } from '@/lib/services/messages.service';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// Stockage en mémoire des tentatives (en production, utilisez Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Fonction de rate limiting
function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const limit = rateLimitMap.get(ip);

    // Nettoyer les entrées expirées
    if (limit && limit.resetTime < now) {
        rateLimitMap.delete(ip);
    }

    // Vérifier la limite
    if (limit && limit.resetTime > now) {
        if (limit.count >= 3) { // 3 messages max par heure
            return false;
        }
        limit.count++;
    } else {
        // Nouvelle entrée : 1 heure de fenêtre
        rateLimitMap.set(ip, {
            count: 1,
            resetTime: now + 60 * 60 * 1000 // 1 heure
        });
    }

    return true;
}

// GET - Récupérer tous les messages (Admin uniquement)
export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const messages = await MessagesService.findAll();

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Créer un nouveau message (Public avec protection anti-spam)
export async function POST(request: NextRequest) {
    try {
        // Récupérer l'IP du client
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Vérifier le rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { message: 'Trop de tentatives. Veuillez réessayer plus tard.' },
                { status: 429 }
            );
        }

        const data = await request.json();

        // Validation supplémentaire des données
        if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
            return NextResponse.json(
                { message: 'Tous les champs sont obligatoires' },
                { status: 400 }
            );
        }

        // Validation basique de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { message: 'Email invalide' },
                { status: 400 }
            );
        }

        // Vérification anti-spam basique du contenu
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'click here'];
        const messageContent = (data.subject + ' ' + data.message).toLowerCase();
        const hasSpam = spamKeywords.some(keyword => messageContent.includes(keyword));

        if (hasSpam) {
            return NextResponse.json(
                { message: 'Message détecté comme spam' },
                { status: 400 }
            );
        }

        // Créer le message
        const message = await MessagesService.create({
            ...data,
            // Ajouter l'IP pour traçabilité (optionnel)
            metadata: {
                ip: ip,
                userAgent: request.headers.get('user-agent') || 'unknown'
            }
        });

        return NextResponse.json({
            message: 'Message envoyé avec succès',
            data: message
        });
    } catch (error) {
        console.error('Create message error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de l\'envoi du message' },
            { status: 500 }
        );
    }
}