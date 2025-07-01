import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ message: 'Aucun fichier trouvé' }, { status: 400 });
        }

        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.' },
                { status: 400 }
            );
        }

        // Vérifier la taille (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { message: 'Le fichier est trop volumineux. Taille maximum : 5MB' },
                { status: 400 }
            );
        }

        // Créer un nom de fichier unique
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileExtension = file.name.split('.').pop();
        const filename = `tickets/${payload.userId}/${uniqueSuffix}.${fileExtension}`;

        // Créer une référence dans Firebase Storage
        const storageRef = ref(storage, filename);

        // Convertir le fichier en buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload vers Firebase Storage
        const snapshot = await uploadBytes(storageRef, buffer, {
            contentType: file.type,
            customMetadata: {
                uploadedBy: payload.userId,
                originalName: file.name
            }
        });

        // Obtenir l'URL de téléchargement
        const downloadURL = await getDownloadURL(snapshot.ref);

        return NextResponse.json({
            message: 'Upload réussi',
            url: downloadURL,
            filename: filename,
            size: file.size,
            type: file.type
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { message: 'Erreur lors de l\'upload' },
            { status: 500 }
        );
    }
}