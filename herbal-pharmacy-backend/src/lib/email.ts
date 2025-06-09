import nodemailer from 'nodemailer'
import { prisma } from './prisma'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      ...options
    })
    
    console.log('Email sent:', result.messageId)
    return result
  } catch (error) {
    console.error('Email send failed:', error)
    throw error
  }
}

export async function sendTemplateEmail(
  templateName: string,
  to: string,
  variables: Record<string, string> = {}
) {
  const template = await prisma.emailTemplate.findUnique({
    where: { name: templateName, isActive: true }
  })

  if (!template) {
    throw new Error(`Email template '${templateName}' not found`)
  }

  let subject = template.subject
  let htmlBody = template.htmlBody
  let textBody = template.textBody || ''

  // Replace variables in template
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    subject = subject.replace(new RegExp(placeholder, 'g'), value)
    htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), value)
    textBody = textBody.replace(new RegExp(placeholder, 'g'), value)
  })

  return sendEmail({
    to,
    subject,
    html: htmlBody,
    text: textBody
  })
}

// Email templates
export const emailTemplates = {
  welcome: {
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
  
  orderConfirmation: {
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
}