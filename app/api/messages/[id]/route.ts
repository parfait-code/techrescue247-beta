import { NextRequest, NextResponse } from 'next/server';
import { MessagesService } from '@/lib/services/messages.service';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Récupérer un message spécifique (Admin uniquement)
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const message = await MessagesService.findById(params.id);
        if (!message) {
            return NextResponse.json({ message: 'Message non trouvé' }, { status: 404 });
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Get message error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// PATCH - Mettre à jour un message (Admin uniquement)
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const data = await request.json();
        const message = await MessagesService.update(params.id, data);

        if (!message) {
            return NextResponse.json({ message: 'Message non trouvé' }, { status: 404 });
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Update message error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un message (Admin uniquement)
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const success = await MessagesService.delete(params.id);
        if (!success) {
            return NextResponse.json({ message: 'Message non trouvé' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Message supprimé avec succès' });
    } catch (error) {
        console.error('Delete message error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}