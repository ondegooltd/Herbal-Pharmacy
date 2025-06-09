import { prisma } from './prisma'

export interface ShippingCalculation {
  baseRate: number
  distanceRate: number
  weightRate: number
  methodMultiplier: number
  total: number
  estimatedDays: string
  method: 'STANDARD' | 'EXPRESS'
}

export interface CartItem {
  productId: string
  quantity: number
  weight?: number
}

// Ghana regions with distance multipliers from Accra (base)
const GHANA_REGIONS = {
  'Greater Accra': { distance: 0, multiplier: 1.0 },
  'Ashanti': { distance: 250, multiplier: 1.3 },
  'Western': { distance: 300, multiplier: 1.4 },
  'Central': { distance: 150, multiplier: 1.2 },
  'Eastern': { distance: 100, multiplier: 1.1 },
  'Volta': { distance: 200, multiplier: 1.25 },
  'Northern': { distance: 600, multiplier: 1.8 },
  'Upper East': { distance: 700, multiplier: 2.0 },
  'Upper West': { distance: 750, multiplier: 2.1 },
  'Brong-Ahafo': { distance: 400, multiplier: 1.5 },
  'Western North': { distance: 350, multiplier: 1.45 },
  'Ahafo': { distance: 380, multiplier: 1.48 },
  'Bono': { distance: 420, multiplier: 1.52 },
  'Bono East': { distance: 450, multiplier: 1.55 },
  'Oti': { distance: 280, multiplier: 1.35 },
  'Savannah': { distance: 550, multiplier: 1.7 },
  'North East': { distance: 650, multiplier: 1.9 }
} as const

// Shipping rates in GH₵
const SHIPPING_RATES = {
  baseRate: 15.00,
  perKmRate: 0.05,
  perKgRate: 2.50,
  methods: {
    STANDARD: {
      multiplier: 1.0,
      days: '3-5 business days'
    },
    EXPRESS: {
      multiplier: 2.0,
      days: '1-2 business days'
    }
  }
}

export async function calculateShipping(
  addressId: string,
  items: CartItem[],
  method: 'STANDARD' | 'EXPRESS' = 'STANDARD'
): Promise<ShippingCalculation> {
  // Get address details
  const address = await prisma.address.findUnique({
    where: { id: addressId }
  })

  if (!address) {
    throw new Error('Address not found')
  }

  // Get region data
  const regionData = GHANA_REGIONS[address.state as keyof typeof GHANA_REGIONS]
  if (!regionData) {
    throw new Error(`Shipping not available to ${address.state}`)
  }

  // Calculate total weight
  let totalWeight = 0
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { weight: true }
    })
    
    const weight = product?.weight ? parseFloat(product.weight.toString()) : 0.5 // Default 0.5kg
    totalWeight += weight * item.quantity
  }

  // Base calculations
  const baseRate = SHIPPING_RATES.baseRate
  const distanceRate = regionData.distance * SHIPPING_RATES.perKmRate * regionData.multiplier
  const weightRate = totalWeight * SHIPPING_RATES.perKgRate
  const methodMultiplier = SHIPPING_RATES.methods[method].multiplier

  // Calculate total
  const subtotal = baseRate + distanceRate + weightRate
  const total = subtotal * methodMultiplier

  return {
    baseRate,
    distanceRate,
    weightRate,
    methodMultiplier,
    total: Math.round(total * 100) / 100,
    estimatedDays: SHIPPING_RATES.methods[method].days,
    method
  }
}

export function getAvailableShippingMethods(state: string) {
  const regionData = GHANA_REGIONS[state as keyof typeof GHANA_REGIONS]
  
  const methods = [
    {
      method: 'STANDARD' as const,
      name: 'Standard Delivery',
      description: '3-5 business days',
      available: !!regionData
    },
    {
      method: 'EXPRESS' as const,
      name: 'Express Delivery',
      description: '1-2 business days',
      available: !!regionData && ['Greater Accra', 'Ashanti', 'Central', 'Eastern'].includes(state)
    }
  ]

  return methods.filter(method => method.available)
}