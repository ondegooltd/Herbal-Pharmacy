export interface Product {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  usage: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  inStock: boolean;
  requiresPrescription: boolean;
  tags: string[];
  ingredients?: string[];
  weight?: number; // in kg for shipping calculations
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // Optional because social login users don't have passwords
  profilePicture?: string;
  address: Address;
  socialAccounts?: {
    google?: {
      id: string;
      email: string;
    };
    facebook?: {
      id: string;
      email: string;
    };
  };
  createdAt: Date;
  lastLoginAt: Date;
  emailVerified: boolean;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
  role: 'user' | 'admin';
  token?: string;
  orders: Order[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: Address;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'mobile-money' | 'cash';
  paymentReference: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'mobile';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface ShippingCalculation {
  baseRate: number;
  distanceRate: number;
  weightRate: number;
  methodMultiplier: number;
  total: number;
  estimatedDays: string;
  method: 'standard' | 'express';
}

export * from './dashboard';
export * from './product';
export * from './order';
export * from './user';
export * from './common';
export * from './components';
export * from './utils';
export * from './api';
export * from './theme';
export * from './validation';