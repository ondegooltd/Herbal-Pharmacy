import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // For now, return a mock admin user
    // In a real application, this would create a user in the database
    return NextResponse.json({
      success: true,
      message: 'Admin setup completed',
      adminUser: {
        email: 'admin@natureheal.com',
        password: 'admin123',
        role: 'ADMIN'
      }
    });
  } catch (error) {
    console.error('Error in admin setup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 