# VIN Checker & Car History Check Platform

A comprehensive web application that provides free VIN decoding and premium car history reports for the UAE automotive market. Built with React, TypeScript, and Express.js with live Stripe payment processing.

## 🚗 Features

### Free VIN Decoding
- **Auto.dev API Integration** - Professional comprehensive vehicle data
- **Instant Results** - Vehicle make, model, year, engine specs
- **Mobile Optimized** - Responsive design for all devices
- **User Tracking** - Email collection for analytics

### Premium Car History Reports ($20)
- **Auction Records** - Complete sales history and pricing data
- **Damage Reports** - Accident and title information
- **Market Valuation** - Current market value estimates
- **Live Stripe Payments** - Secure payment processing

### UAE Market Focus
- **Currency Display** - USD and AED pricing
- **GCC Integration** - Regional vehicle import data
- **Dubai Optimized** - Local market insights
- **Arabic Ready** - Multilingual support framework

## 🛡️ Security Features

- **Input Validation** - XSS protection and VIN format validation
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Domain whitelist security
- **Token Authentication** - Secure API access
- **Production Safe** - Debug logs disabled in production

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Reliable data storage
- **Stripe** - Payment processing
- **Email Services** - Multiple delivery methods

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vin-checker.git
   cd vin-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URL
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file with these required variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Stripe (Live Keys for Production)
STRIPE_SECRET_KEY_LIVE=sk_live_your_secret_key
VITE_STRIPE_PUBLIC_KEY_LIVE=pk_live_your_public_key

# Vehicle Database API
VEHICLE_DATABASE_API_KEY=your_api_key

# Email Services (Optional)
SENDGRID_API_KEY=your_sendgrid_key

# Security
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

## 📦 Deployment

### Option 1: Replit
1. Import repository to Replit
2. Set environment variables in Secrets
3. Run `npm run dev`
4. Deploy using Replit's deployment feature

### Option 2: Vercel
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Option 3: Traditional Hosting
1. Build: `npm run build`
2. Upload `dist/` folder
3. Configure server for Express.js API

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/vin/:vin` - Free VIN decoding
- `POST /api/vin-search` - Track VIN searches

### Protected Endpoints  
- `POST /api/create-payment-intent` - Stripe payment
- `GET /api/vehicle-history/:vin` - Premium reports
- `GET /api/admin/vin-searches` - Analytics dashboard

## 📊 Database Schema

### Core Tables
- `users` - User management
- `vin_checks` - VIN decoding cache
- `vin_searches` - User tracking and analytics
- `car_history_reports` - Premium report data

## 💳 Payment Integration

### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from dashboard
3. Configure webhook endpoints
4. Test with card: `4242 4242 4242 4242`

## 📧 Email Notifications

Multiple delivery methods ensure reliability:
- **SendGrid** (primary)
- **SMTP fallback**
- **Webhook notifications**
- **File logging**

## 🔍 Testing

### VIN Testing
Use these sample VINs:
- `1HGBH41JXMN109186` (Honda Civic)
- `2T2BK1BA5FC332380` (Toyota Highlander)
- `WBS8M9C50J5L00217` (BMW 3 Series)

### Payment Testing
- Card: `4242 4242 4242 4242`
- CVV: Any 3 digits
- Expiry: Any future date

## 📱 Mobile Support

- **Responsive Design** - Works on all screen sizes
- **Touch Optimized** - Mobile-friendly interactions
- **Fast Loading** - Optimized for mobile networks
- **PWA Ready** - Progressive Web App capabilities

## 🌍 Internationalization

- **Multi-Currency** - USD and AED display
- **Regional Data** - GCC market focus
- **Language Ready** - Framework for Arabic support
- **Local Insights** - UAE-specific vehicle data

## 📈 Analytics

### User Tracking
- Email collection for all searches
- IP address and device information
- Search patterns and popular VINs
- Payment conversion rates

### Admin Dashboard
Access analytics at `/api/admin/vin-searches`:
- Total searches performed
- User engagement metrics
- Revenue tracking
- Popular vehicle searches

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Apply database changes
npm run db:studio    # View database
```

### Project Structure
```
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
├── docs/           # Documentation
└── package.json    # Dependencies and scripts
```

## 🔒 Security Compliance

- **OWASP Standards** - Web application security
- **PCI DSS Ready** - Payment card security
- **GDPR Compliant** - User data protection
- **Input Sanitization** - XSS and injection prevention

## 📞 Support

For technical support or questions:
- **Email**: support@carsclub.ae
- **Documentation**: Check `/docs` folder
- **Issues**: Use GitHub Issues

## 📄 License

All rights reserved by carsclub.ae - 2025

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

---

**Built with ❤️ for the UAE automotive market**