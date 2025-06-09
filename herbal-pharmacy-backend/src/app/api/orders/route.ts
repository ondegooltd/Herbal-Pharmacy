import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { createOrderSchema } from '@/lib/validation'
import { calculateShipping } from '@/lib/shipping'
import { sendTemplateEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isMain: true }, take: 1 }
                }
              }
            }
          },
          shippingAddress: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where: { userId: user.id } })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const validatedData = createOrderSchema.parse(body)

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Verify all products exist and are in stock
      const products = await tx.product.findMany({
        where: {
          id: { in: validatedData.items.map(item => item.productId) },
          isActive: true,
          inStock: true
        }
      })

      if (products.length !== validatedData.items.length) {
        throw new Error('Some products are not available')
      }

      // Check stock for each item
      for (const item of validatedData.items) {
        const product = products.find(p => p.id === item.productId)
        if (!product || product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product?.name || 'product'}`)
        }
      }

      // Calculate totals
      let subtotal = 0
      const orderItems = validatedData.items.map(item => {
        const product = products.find(p => p.id === item.productId)!
        const price = parseFloat(product.price.toString())
        subtotal += price * item.quantity
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        }
      })

      // Calculate shipping
      const shippingCalculation = await calculateShipping(
        validatedData.shippingAddressId,
        validatedData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        validatedData.shippingMethod
      )

      const tax = subtotal * 0.08 // 8% tax
      const total = subtotal + shippingCalculation.total + tax

      // Generate order number
      const orderNumber = `NH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          subtotal,
          shippingCost: shippingCalculation.total,
          tax,
          total,
          shippingMethod: validatedData.shippingMethod,
          paymentMethod: validatedData.paymentMethod,
          shippingAddressId: validatedData.shippingAddressId,
          estimatedDelivery: shippingCalculation.estimatedDays,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isMain: true }, take: 1 }
                }
              }
            }
          },
          shippingAddress: true
        }
      })

      // Update product stock
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        })
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      })

      return order
    })

    // Send order confirmation email
    try {
      await sendTemplateEmail('order_confirmation', user.email, {
        firstName: user.name.split(' ')[0],
        orderNumber: result.orderNumber,
        orderDate: result.createdAt.toLocaleDateString(),
        totalAmount: result.total.toString(),
        estimatedDelivery: result.estimatedDelivery || 'TBD',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
    }

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Order creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}