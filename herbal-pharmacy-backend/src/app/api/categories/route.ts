import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        ...(includeProducts && {
          products: {
            where: { isActive: true },
            take: 5,
            include: {
              images: { where: { isMain: true }, take: 1 }
            }
          }
        }),
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}