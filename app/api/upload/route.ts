import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const data = await request.formData()
        const file: File | null = data.get('file') as unknown as File

        if (!file) {
            return NextResponse.json({ message: 'Aucun fichier trouvé' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const filename = `${uniqueSuffix}-${file.name}`
        const path = join(process.cwd(), 'public', 'uploads', filename)

        // Save file
        await writeFile(path, buffer)

        return NextResponse.json({
            message: 'Upload réussi',
            url: `/uploads/${filename}`
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de l\'upload' },
            { status: 500 }
        )
    }
}