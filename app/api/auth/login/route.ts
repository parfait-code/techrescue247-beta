import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { email, password } = await request.json()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            )
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            )
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        })

        return NextResponse.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}