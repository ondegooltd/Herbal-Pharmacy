# NatureHeal - Herbal Pharmacy E-commerce Platform

NatureHeal is a modern e-commerce platform specializing in herbal and natural health products. Built with React and TypeScript, it provides a seamless shopping experience for customers looking for natural health solutions.

## 🌟 Features

### User Features
- **Authentication System**
  - Email and phone number sign-in/signup
  - Social login (Google, Facebook)
  - Password strength validation
  - Account verification

- **Shopping Experience**
  - Browse products by categories
  - Search functionality
  - Wishlist management
  - Shopping cart
  - Order tracking
  - Product reviews and ratings

- **Payment Integration**
  - Multiple payment methods
    - Card payments (Paystack)
    - Mobile Money
    - PayPal (coming soon)
  - Secure payment processing
  - Payment verification system

- **User Dashboard**
  - Profile management
  - Order history
  - Address management
  - Payment method management
  - Account settings
  - Notification preferences

### Admin Features
- Product management
- Order management
- User management
- Inventory tracking
- Sales analytics

## 🛠️ Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Router v6
  - Context API for state management
  - Lucide React for icons
  - Vite for build tooling
  - ESLint & Prettier for code quality
  - Jest & React Testing Library for testing

- **Backend** (Coming Soon)
  - Node.js (v18 LTS)
  - Express.js
  - MongoDB with Mongoose
  - JWT Authentication
  - Redis for caching
  - Socket.IO for real-time features

- **Payment Processing**
  - Paystack Integration
  - Mobile Money Integration
  - Payment verification system
  - Transaction logging

- **DevOps & Infrastructure**
  - Docker containerization
  - GitHub Actions for CI/CD
  - AWS S3 for static assets
  - CloudFront CDN
  - MongoDB Atlas for database

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/herbal_pharmacy.git
cd herbal_pharmacy
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory
```env
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones
- Tablets
- Desktop computers
- Large screens

## 🔒 Security Features

- Secure authentication
- Protected routes
- Payment data encryption
- Input validation
- XSS protection
- CSRF protection

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📦 Build

```bash
npm run build
# or
yarn build
```

## 🌐 Deployment

### Production Deployment

1. **Prepare the Environment**
```bash
# Build the application
npm run build

# Test the production build locally
npm run preview
```

2. **Environment Variables**
Create a `.env.production` file with:
```env
VITE_API_URL=https://api.natureheal.com
VITE_PAYSTACK_PUBLIC_KEY=your_production_paystack_key
VITE_PAYSTACK_SECRET_KEY=your_production_paystack_secret
NODE_ENV=production
```

3. **Deployment Platforms**

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### AWS Deployment
```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Docker Deployment
```bash
# Build the Docker image
docker build -t natureheal:latest .

# Run the container
docker run -p 80:80 natureheal:latest
```

### Monitoring & Maintenance
- Set up error tracking with Sentry
- Configure uptime monitoring
- Set up automated backups
- Implement logging with CloudWatch
- Configure SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Project Manager & Lead Developer: Elisha Awuni
  - Full-stack development
  - System architecture
  - Project management
  - DevOps & deployment
  - Security implementation

- UI/UX Designer: [Position Open]
- Backend Developer: [Position Open]
- Quality Assurance Engineer: [Position Open]

## 📞 Support

For support, email support@natureheal.com or join our Slack channel.

## 🙏 Acknowledgments

- [Paystack](https://paystack.com/) for payment processing
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 🔄 Updates

### Latest Updates
- Added mobile money payment integration
- Implemented payment verification system
- Enhanced mobile responsiveness
- Added user dashboard features

### Coming Soon
- PayPal integration
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Loyalty program

---

Made with ❤️ by the NatureHeal Team 