import { NextRequest, NextResponse } from 'next/server';
import { MessagesService } from '@/lib/services/messages.service';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

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

// POST - Créer un nouveau message (Public)
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const message = await MessagesService.create(data);

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