import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Simple admin check - in production, use proper authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== 'mock-admin-token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total orders and revenue
    const orders = await prisma.order.findMany();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    // Get recent orders
    const recentOrders = orders.slice(0, 5);

    // Get order trends (last 7 days)
    const orderTrends = await prisma.order.groupBy();

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      recentOrders,
      orderTrends: orderTrends.map(trend => ({
        date: trend.createdAt,
        orders: trend._count.id,
        revenue: Number(trend._sum.total),
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 