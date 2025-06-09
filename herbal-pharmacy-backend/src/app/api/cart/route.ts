import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { addToCartSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            },
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price.toString()) * item.quantity)
    }, 0)

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      items: cartItems,
      subtotal,
      itemCount
    })

  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const validatedData = addToCartSchema.parse(body)

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { 
        id: validatedData.productId,
        isActive: true,
        inStock: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or out of stock' },
        { status: 404 }
      )
    }

    // Check stock availability
    if (product.stockQuantity < validatedData.quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + validatedData.quantity,
          updatedAt: new Date()
        },
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 }
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity
        },
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 }
            }
          }
        }
      })
    }

    return NextResponse.json(cartItem, { status: 201 })

  } catch (error) {
    console.error('Add to cart error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}