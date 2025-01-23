import { prisma } from '@repo/database'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const createListSchema = z.object({
    name: z.string().min(1, 'List name is required'),
    items: z.array(z.object({
        name: z.string(),
        quantity: z.string().optional()
    })).optional()
})

export async function GET() {
    try {
        const lists = await prisma.shoppingList.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return NextResponse.json(lists)
    } catch (error) {
        console.log('Error fetching shopping lists:', error)
        return NextResponse.json(
            { error: 'Error fetching shopping lists' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const parsed = createListSchema.safeParse(json)

        if (!parsed.success) {
            const errorMessage = parsed.error.errors[0]?.message || 'Invalid input'
            return NextResponse.json(
                { error: errorMessage },
                { status: 400 }
            )
        }

        try {
            const list = await prisma.shoppingList.create({
                data: {
                    name: parsed.data.name,
                    items: parsed.data.items ? {
                        create: parsed.data.items
                    } : undefined
                },
                include: {
                    items: true
                }
            })
            return NextResponse.json(list)
        } catch (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json(
                { error: 'Failed to create shopping list in database' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Error processing request:', error)
        return NextResponse.json(
            { error: 'Error creating shopping list' },
            { status: 500 }
        )
    }
} 