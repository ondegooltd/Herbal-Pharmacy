export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number; // in kg
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
};

// Shipping rates in GH₵
const SHIPPING_RATES = {
  baseRate: 15.00, // Base shipping cost
  perKmRate: 0.05, // Cost per kilometer
  perKgRate: 2.50, // Cost per kilogram
  methods: {
    standard: {
      multiplier: 1.0,
      days: '3-5 business days'
    },
    express: {
      multiplier: 2.0,
      days: '1-2 business days'
    }
  },
  freeShippingThreshold: 0 // No free shipping available
};

class ShippingService {
  
  /**
   * Calculate shipping cost based on destination, weight, and method
   */
  calculateShipping(
    address: ShippingAddress,
    items: CartItem[],
    method: 'standard' | 'express' = 'standard'
  ): ShippingCalculation {
    try {
      // Get region data
      const regionData = GHANA_REGIONS[address.state as keyof typeof GHANA_REGIONS];
      if (!regionData) {
        throw new Error(`Shipping not available to ${address.state}`);
      }

      // Calculate total weight
      const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
      
      // Base calculations
      const baseRate = SHIPPING_RATES.baseRate;
      const distanceRate = regionData.distance * SHIPPING_RATES.perKmRate * regionData.multiplier;
      const weightRate = totalWeight * SHIPPING_RATES.perKgRate;
      const methodMultiplier = SHIPPING_RATES.methods[method].multiplier;
      
      // Calculate total
      const subtotal = baseRate + distanceRate + weightRate;
      const total = subtotal * methodMultiplier;

      return {
        baseRate,
        distanceRate,
        weightRate,
        methodMultiplier,
        total: Math.round(total * 100) / 100, // Round to 2 decimal places
        estimatedDays: SHIPPING_RATES.methods[method].days,
        method
      };
    } catch (error) {
      console.error('Shipping calculation error:', error);
      throw error;
    }
  }

  /**
   * Get available shipping methods for a destination
   */
  getAvailableShippingMethods(address: ShippingAddress): Array<{
    method: 'standard' | 'express';
    name: string;
    description: string;
    available: boolean;
  }> {
    const regionData = GHANA_REGIONS[address.state as keyof typeof GHANA_REGIONS];
    
    const methods = [
      {
        method: 'standard' as const,
        name: 'Standard Delivery',
        description: '3-5 business days',
        available: !!regionData
      },
      {
        method: 'express' as const,
        name: 'Express Delivery',
        description: '1-2 business days',
        available: !!regionData && ['Greater Accra', 'Ashanti', 'Central', 'Eastern'].includes(address.state)
      }
    ];

    return methods;
  }

  /**
   * Validate shipping address
   */
  validateShippingAddress(address: ShippingAddress): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!address.street?.trim()) {
      errors.push('Street address is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State/Region is required');
    } else if (!GHANA_REGIONS[address.state as keyof typeof GHANA_REGIONS]) {
      errors.push('Invalid state/region selected');
    }

    if (address.country !== 'Ghana') {
      errors.push('We currently only ship within Ghana');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get shipping zones and their rates
   */
  getShippingZones(): Array<{
    zone: string;
    regions: string[];
    baseMultiplier: number;
    expressAvailable: boolean;
  }> {
    return [
      {
        zone: 'Zone 1 - Greater Accra',
        regions: ['Greater Accra'],
        baseMultiplier: 1.0,
        expressAvailable: true
      },
      {
        zone: 'Zone 2 - Central & Eastern',
        regions: ['Central', 'Eastern', 'Volta'],
        baseMultiplier: 1.2,
        expressAvailable: true
      },
      {
        zone: 'Zone 3 - Ashanti & Western',
        regions: ['Ashanti', 'Western', 'Western North'],
        baseMultiplier: 1.4,
        expressAvailable: true
      },
      {
        zone: 'Zone 4 - Northern Regions',
        regions: ['Northern', 'Upper East', 'Upper West', 'Savannah', 'North East'],
        baseMultiplier: 1.8,
        expressAvailable: false
      },
      {
        zone: 'Zone 5 - Other Regions',
        regions: ['Brong-Ahafo', 'Ahafo', 'Bono', 'Bono East', 'Oti'],
        baseMultiplier: 1.5,
        expressAvailable: false
      }
    ];
  }

  /**
   * Estimate delivery date
   */
  estimateDeliveryDate(
    address: ShippingAddress,
    method: 'standard' | 'express' = 'standard'
  ): {
    minDays: number;
    maxDays: number;
    estimatedDate: string;
  } {
    const regionData = GHANA_REGIONS[address.state as keyof typeof GHANA_REGIONS];
    
    let baseDays = method === 'express' ? 1 : 3;
    let maxDays = method === 'express' ? 2 : 5;
    
    // Add extra days for remote regions
    if (regionData && regionData.multiplier > 1.5) {
      baseDays += 1;
      maxDays += 2;
    }

    const today = new Date();
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + maxDays);

    return {
      minDays: baseDays,
      maxDays,
      estimatedDate: estimatedDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }

  /**
   * Get shipping rate breakdown for transparency
   */
  getShippingBreakdown(
    address: ShippingAddress,
    items: CartItem[],
    method: 'standard' | 'express' = 'standard'
  ): {
    breakdown: Array<{
      description: string;
      amount: number;
    }>;
    total: number;
  } {
    const calculation = this.calculateShipping(address, items, method);
    const regionData = GHANA_REGIONS[address.state as keyof typeof GHANA_REGIONS];
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

    const breakdown = [
      {
        description: 'Base shipping fee',
        amount: calculation.baseRate
      },
      {
        description: `Distance fee (${regionData?.distance || 0}km to ${address.state})`,
        amount: calculation.distanceRate
      },
      {
        description: `Weight fee (${totalWeight}kg)`,
        amount: calculation.weightRate
      }
    ];

    if (method === 'express') {
      breakdown.push({
        description: 'Express delivery surcharge',
        amount: calculation.total - (calculation.baseRate + calculation.distanceRate + calculation.weightRate)
      });
    }

    return {
      breakdown,
      total: calculation.total
    };
  }
}

export const shippingService = new ShippingService();