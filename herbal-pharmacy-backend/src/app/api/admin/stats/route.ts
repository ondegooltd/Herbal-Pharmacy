import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);

    // Fetch total users
    const totalUsers = await prisma.user.count({
      where: {
        role: 'USER'
      }
    });

    // Fetch total orders
    const totalOrders = await prisma.order.count();

    // Fetch total products
    const totalProducts = await prisma.product.count();

    // Fetch recent orders with user details
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 