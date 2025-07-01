import { NextRequest, NextResponse } from 'next/server';
import { UsersService } from '@/lib/services/users.service';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

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
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        // Seuls les admins ou l'utilisateur lui-même peuvent accéder aux détails
        if (payload.role !== 'admin' && payload.userId !== params.id) {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const user = await UsersService.findById(params.id);

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Supprimer le mot de passe
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

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
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        // Seuls les admins peuvent mettre à jour les rôles des utilisateurs
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const data = await request.json();

        // Empêcher la mise à jour du mot de passe via cette route
        delete data.password;

        const user = await UsersService.update(params.id, data);

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Supprimer le mot de passe
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

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
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        // Seuls les admins peuvent supprimer des utilisateurs
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const success = await UsersService.delete(params.id);

        if (!success) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}