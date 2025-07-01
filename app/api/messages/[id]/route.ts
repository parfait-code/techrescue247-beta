import { NextRequest, NextResponse } from 'next/server';
import {
    adminDb,
    verifyFirebaseToken,
    unauthorizedResponse,
    forbiddenResponse
} from '@/lib/firebase-admin';
import { serverTimestamp } from 'firebase-admin/firestore';

// GET - Récupérer un message spécifique (Admin uniquement)
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        // Vérifier l'authentification Firebase
        const user = await verifyFirebaseToken(request);
        if (!user) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent voir les messages
        if (user.role !== 'admin') {
            return forbiddenResponse();
        }

        // Récupérer le message
        const messageDoc = await adminDb
            .collection('messages')
            .doc(params.id)
            .get();

        if (!messageDoc.exists) {
            return NextResponse.json(
                { message: 'Message non trouvé' },
                { status: 404 }
            );
        }

        const data = messageDoc.data();
        const message = {
            id: messageDoc.id,
            ...data,
            createdAt: data?.createdAt?.toDate(),
            updatedAt: data?.updatedAt?.toDate(),
            repliedAt: data?.repliedAt?.toDate(),
        };

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
        // Vérifier l'authentification Firebase
        const user = await verifyFirebaseToken(request);
        if (!user) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent mettre à jour les messages
        if (user.role !== 'admin') {
            return forbiddenResponse();
        }

        const data = await request.json();

        // Préparer les données de mise à jour
        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        // Si le statut passe à "replied", ajouter la date de réponse
        if (data.status === 'replied' && !data.repliedAt) {
            updateData.repliedAt = serverTimestamp();
        }

        // Mettre à jour le message
        await adminDb
            .collection('messages')
            .doc(params.id)
            .update(updateData);

        // Récupérer le message mis à jour
        const updatedDoc = await adminDb
            .collection('messages')
            .doc(params.id)
            .get();

        if (!updatedDoc.exists) {
            return NextResponse.json(
                { message: 'Message non trouvé' },
                { status: 404 }
            );
        }

        const messageData = updatedDoc.data();
        const message = {
            id: updatedDoc.id,
            ...messageData,
            createdAt: messageData?.createdAt?.toDate(),
            updatedAt: messageData?.updatedAt?.toDate(),
            repliedAt: messageData?.repliedAt?.toDate(),
        };

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
        // Vérifier l'authentification Firebase
        const user = await verifyFirebaseToken(request);
        if (!user) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent supprimer les messages
        if (user.role !== 'admin') {
            return forbiddenResponse();
        }

        // Vérifier que le message existe
        const messageDoc = await adminDb
            .collection('messages')
            .doc(params.id)
            .get();

        if (!messageDoc.exists) {
            return NextResponse.json(
                { message: 'Message non trouvé' },
                { status: 404 }
            );
        }

        // Supprimer le message
        await adminDb
            .collection('messages')
            .doc(params.id)
            .delete();

        return NextResponse.json(
            { message: 'Message supprimé avec succès' }
        );
    } catch (error) {
        console.error('Delete message error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}