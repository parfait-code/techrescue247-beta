import { NextRequest } from 'next/server';
// import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import {
    adminDb,
    unauthorizedResponse,
    forbiddenResponse,
    serverErrorResponse,
    notFoundResponse,
    successResponse
} from '@/lib/firebase-admin';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Récupérer un utilisateur spécifique
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier l'authentification
        const token = getTokenFromRequest(request);
        if (!token) {
            return unauthorizedResponse();
        }

        const payload = verifyToken(token);
        if (!payload) {
            return unauthorizedResponse();
        }

        // Vérifier les permissions : admin ou l'utilisateur lui-même
        if (payload.role !== 'admin' && payload.userId !== params.id) {
            return forbiddenResponse();
        }

        // Récupérer l'utilisateur depuis Firestore
        const userDoc = await adminDb.collection('users').doc(params.id).get();

        if (!userDoc.exists) {
            return notFoundResponse('Utilisateur non trouvé');
        }

        const userData = userDoc.data();

        // Retirer le mot de passe si présent
        const { password, ...userWithoutPassword } = userData || {};

        return successResponse({
            _id: userDoc.id,
            ...userWithoutPassword
        });

    } catch (error) {
        console.error('Get user error:', error);
        return serverErrorResponse('Erreur lors de la récupération de l\'utilisateur', error);
    }
}

// PATCH - Mettre à jour un utilisateur
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier l'authentification
        const token = getTokenFromRequest(request);
        if (!token) {
            return unauthorizedResponse();
        }

        const payload = verifyToken(token);
        if (!payload) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent mettre à jour les utilisateurs
        if (payload.role !== 'admin') {
            return forbiddenResponse();
        }

        // Récupérer les données de la requête
        const data = await request.json();

        // Retirer le mot de passe pour éviter sa modification via cette route
        delete data.password;

        // Ajouter la date de mise à jour
        data.updatedAt = new Date();

        // Référence au document utilisateur
        const userRef = adminDb.collection('users').doc(params.id);

        // Vérifier que l'utilisateur existe
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return notFoundResponse('Utilisateur non trouvé');
        }

        // Mettre à jour l'utilisateur
        await userRef.update(data);

        // Récupérer les données mises à jour
        const updatedDoc = await userRef.get();
        const updatedData = updatedDoc.data();

        // Retirer le mot de passe
        const { password, ...userWithoutPassword } = updatedData || {};

        return successResponse({
            _id: updatedDoc.id,
            ...userWithoutPassword
        }, 'Utilisateur mis à jour avec succès');

    } catch (error) {
        console.error('Update user error:', error);
        return serverErrorResponse('Erreur lors de la mise à jour', error);
    }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier l'authentification
        const token = getTokenFromRequest(request);
        if (!token) {
            return unauthorizedResponse();
        }

        const payload = verifyToken(token);
        if (!payload) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent supprimer des utilisateurs
        if (payload.role !== 'admin') {
            return forbiddenResponse();
        }

        // Référence au document utilisateur
        const userRef = adminDb.collection('users').doc(params.id);

        // Vérifier que l'utilisateur existe
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return notFoundResponse('Utilisateur non trouvé');
        }

        // Supprimer l'utilisateur de Firestore
        await userRef.delete();

        // Optionnel : Supprimer aussi l'utilisateur de Firebase Auth
        try {
            await adminAuth.deleteUser(params.id);
        } catch (authError) {
            console.warn('Could not delete user from Firebase Auth:', authError);
            // Continuer même si la suppression Auth échoue
        }

        return successResponse(null, 'Utilisateur supprimé avec succès');

    } catch (error) {
        console.error('Delete user error:', error);
        return serverErrorResponse('Erreur lors de la suppression', error);
    }
}