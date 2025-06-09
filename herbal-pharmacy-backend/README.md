# Herbal Pharmacy Backend

A comprehensive Next.js backend API for the NatureHeal herbal pharmacy marketplace.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations for products, categories, and inventory
- **Order Processing**: Complete order lifecycle management
- **Cart Management**: Persistent shopping cart functionality
- **Shipping Calculations**: Ghana-specific shipping cost calculations
- **Email Notifications**: Automated email templates for user actions
- **Database**: PostgreSQL with Prisma ORM
- **File Uploads**: Cloudinary integration for product images
- **Payment Processing**: Stripe integration for payments
- **Mobile Money**: Ghana mobile money payment support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Email**: Nodemailer with SMTP
- **File Storage**: Cloudinary
- **Payments**: Stripe
- **Validation**: Zod schemas
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for images)
- Stripe account (for payments)
- SMTP email service

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd herbal-pharmacy-backend
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local` and update with your credentials:
   ```bash
   cp .env.local .env.local
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Addresses
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address

### Shipping
- `POST /api/shipping/calculate` - Calculate shipping costs

## Database Schema

The database includes the following main entities:

- **Users**: Customer and admin accounts
- **Products**: Product catalog with categories
- **Orders**: Order management and tracking
- **Cart**: Shopping cart functionality
- **Addresses**: User shipping addresses
- **Reviews**: Product reviews and ratings

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Ghana-Specific Features

### Shipping Calculations
- Region-based shipping rates
- Distance and weight calculations
- Standard and express delivery options

### Mobile Money Integration
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

### Local Adaptations
- Ghana Cedis (GH₵) currency
- Ghana regions and postal codes
- Local payment methods

## Development

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Create new migration
npm run db:migrate

# Reset database
npm run db:push --force-reset
```

### Code Quality
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up production database:**
   - Update `DATABASE_URL` in production environment
   - Run migrations: `npm run db:migrate`

3. **Deploy to your preferred platform:**
   - Vercel (recommended for Next.js)
   - Railway
   - Heroku
   - DigitalOcean

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="your-jwt-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend
FRONTEND_URL="https://your-frontend-domain.com"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for NatureHeal marketplace.