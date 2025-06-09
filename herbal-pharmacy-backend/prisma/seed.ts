import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'herbal-supplements' },
      update: {},
      create: {
        name: 'Herbal Supplements',
        slug: 'herbal-supplements',
        description: 'Natural herbal remedies and supplements',
        icon: 'leaf',
        sortOrder: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'black-soap' },
      update: {},
      create: {
        name: 'African Black Soap',
        slug: 'black-soap',
        description: 'Authentic handcrafted African black soap',
        icon: 'soap',
        sortOrder: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'shea-butter' },
      update: {},
      create: {
        name: 'Pure Shea Butter',
        slug: 'shea-butter',
        description: 'Raw unrefined shea butter products',
        icon: 'heart',
        sortOrder: 3
      }
    }),
    prisma.category.upsert({
      where: { slug: 'tree-bark-roots' },
      update: {},
      create: {
        name: 'Tree Bark & Roots',
        slug: 'tree-bark-roots',
        description: 'Traditional medicinal tree bark and root extracts',
        icon: 'tree-pine',
        sortOrder: 4
      }
    }),
    prisma.category.upsert({
      where: { slug: 'immune-support' },
      update: {},
      create: {
        name: 'Immune Support',
        slug: 'immune-support',
        description: 'Natural immune system boosters',
        icon: 'shield-check',
        sortOrder: 5
      }
    })
  ])

  console.log('✅ Categories created')

  // Create sample products
  const products = [
    {
      name: 'Organic Moringa Powder',
      slug: 'organic-moringa-powder',
      description: 'Premium quality moringa powder packed with essential vitamins and minerals.',
      shortDescription: 'Nutrient-rich superfood powder',
      price: 24.99,
      originalPrice: 29.99,
      sku: 'NH-MORINGA-001',
      weight: 0.5,
      benefits: ['Rich in iron and antioxidants', 'Supports immune system', 'Natural energy booster'],
      usage: 'Mix 1 teaspoon in water, juice, or smoothie daily.',
      ingredients: ['100% Organic Moringa Oleifera Leaf Powder'],
      stockQuantity: 100,
      categoryId: categories[0].id,
      isFeatured: true,
      tags: ['organic', 'superfood', 'vitamin-rich']
    },
    {
      name: 'Authentic African Black Soap',
      slug: 'authentic-african-black-soap',
      description: 'Handcrafted traditional African black soap made from plantain skins, palm kernel oil, and cocoa pods.',
      shortDescription: 'Traditional handcrafted black soap',
      price: 12.99,
      sku: 'NH-BLACKSOAP-001',
      weight: 0.2,
      benefits: ['Deep cleansing', 'Natural moisturizing', 'Suitable for all skin types'],
      usage: 'Wet soap and lather in hands. Apply to wet skin and rinse thoroughly.',
      ingredients: ['Plantain Skins', 'Palm Kernel Oil', 'Cocoa Pods', 'Shea Butter'],
      stockQuantity: 150,
      categoryId: categories[1].id,
      isFeatured: true,
      tags: ['natural', 'skincare', 'traditional']
    },
    {
      name: 'Raw Unrefined Shea Butter',
      slug: 'raw-unrefined-shea-butter',
      description: 'Pure, unrefined shea butter sourced directly from Ghana. Rich in vitamins A and E.',
      shortDescription: 'Pure unrefined shea butter',
      price: 18.99,
      sku: 'NH-SHEA-001',
      weight: 0.3,
      benefits: ['Deep moisturizing', 'Anti-inflammatory', 'Natural sun protection'],
      usage: 'Apply small amount to skin and massage gently until absorbed.',
      ingredients: ['100% Pure Unrefined Shea Butter'],
      stockQuantity: 80,
      categoryId: categories[2].id,
      isFeatured: true,
      tags: ['pure', 'moisturizer', 'natural']
    }
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData
    })

    // Add main product image
    await prisma.productImage.upsert({
      where: { 
        productId_sortOrder: {
          productId: product.id,
          sortOrder: 0
        }
      },
      update: {},
      create: {
        productId: product.id,
        url: 'https://images.pexels.com/photos/3735632/pexels-photo-3735632.jpeg',
        altText: productData.name,
        sortOrder: 0,
        isMain: true
      }
    })
  }

  console.log('✅ Products created')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  await prisma.user.upsert({
    where: { email: 'admin@natureheal.com' },
    update: {},
    create: {
      email: 'admin@natureheal.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true
    }
  })

  console.log('✅ Admin user created')

  // Create email templates
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to NatureHeal - Your Natural Health Journey Begins!',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3A7D44;">Welcome to NatureHeal, {{firstName}}!</h1>
          <p>Thank you for joining our community of natural health enthusiasts.</p>
          <p>Your account has been successfully created. You can now:</p>
          <ul>
            <li>Browse our extensive collection of natural health products</li>
            <li>Track your orders and delivery status</li>
            <li>Save your favorite products to your wishlist</li>
            <li>Get personalized health recommendations</li>
          </ul>
          <a href="{{frontendUrl}}" style="background-color: #3A7D44; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Start Shopping
          </a>
          <p>If you have any questions, our customer support team is here to help.</p>
          <p>Best regards,<br>The NatureHeal Team</p>
        </div>
      `,
      textBody: 'Welcome to NatureHeal, {{firstName}}! Your account has been successfully created.'
    },
    {
      name: 'order_confirmation',
      subject: 'Order Confirmation - {{orderNumber}}',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3A7D44;">Order Confirmed!</h1>
          <p>Hi {{firstName}},</p>
          <p>Thank you for your order! We've received your order <strong>{{orderNumber}}</strong> and it's being processed.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> {{orderNumber}}</p>
            <p><strong>Order Date:</strong> {{orderDate}}</p>
            <p><strong>Total Amount:</strong> GH₵ {{totalAmount}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
          </div>
          
          <p>You'll receive another email with tracking information once your order ships.</p>
          
          <a href="{{frontendUrl}}/account?tab=orders" style="background-color: #3A7D44; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Track Your Order
          </a>
          
          <p>Thank you for choosing NatureHeal!</p>
        </div>
      `,
      textBody: 'Your order {{orderNumber}} has been confirmed. Total: GH₵ {{totalAmount}}'
    }
  ]

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template
    })
  }

  console.log('✅ Email templates created')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })