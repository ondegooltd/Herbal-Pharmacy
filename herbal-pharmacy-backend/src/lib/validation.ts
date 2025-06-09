import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms'),
  subscribeNewsletter: z.boolean().optional()
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().cuid('Invalid category ID'),
  benefits: z.array(z.string()).optional(),
  usage: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  weight: z.number().positive().optional(),
  requiresPrescription: z.boolean().optional(),
  tags: z.array(z.string()).optional()
})

// Order validation schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive()
  })).min(1, 'Order must have at least one item'),
  shippingAddressId: z.string().cuid(),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'PICKUP']),
  paymentMethod: z.enum(['CARD', 'MOBILE_MONEY', 'PAYPAL', 'BANK_TRANSFER'])
})

// Address validation schemas
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().optional(),
  country: z.string().default('Ghana'),
  isDefault: z.boolean().optional()
})

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive')
})

// Review validation schemas
export const createReviewSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  comment: z.string().optional()
})

// Shipping calculation schema
export const shippingCalculationSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive()
  })),
  addressId: z.string().cuid(),
  method: z.enum(['STANDARD', 'EXPRESS']).optional()
})