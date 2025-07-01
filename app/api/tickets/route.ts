import { NextRequest, NextResponse } from 'next/server';
import { TicketsService } from '@/lib/services/tickets.service';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        let tickets;
        if (payload.role === 'admin') {
            // Admin peut voir tous les tickets
            tickets = await TicketsService.findAll();
        } else {
            // Les utilisateurs ne voient que leurs tickets
            tickets = await TicketsService.findByUserId(payload.userId);
        }

        return NextResponse.json(tickets);
    } catch (error) {
        console.error('Get tickets error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const data = await request.json();
        const ticket = await TicketsService.create({
            ...data,
            userId: payload.userId,
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error('Create ticket error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la création du ticket' },
            { status: 500 }
        );
    }
}