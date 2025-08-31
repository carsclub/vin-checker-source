# VIN Decoder & Lookup Application

## Overview
This project is a comprehensive web application offering free VIN (Vehicle Identification Number) decoding and lookup services. It enables users to input a 17-character VIN and receive detailed vehicle information such as manufacturer, model, year, engine specifications, and country of origin. The application integrates with the Auto.dev API for real-time data and utilizes a local database for caching, aiming to build user trust for premium report purchases. The business vision is to provide accurate and detailed vehicle data, leading to the sale of full vehicle history reports.

## Recent Changes (August 2025)
- **Nissan VIN Decoding FIXED**: Completely resolved the issue where all Nissan models incorrectly showed as "Altima" (August 28, 2025)
  - Created centralized `vinDecoder.ts` module with comprehensive Nissan VIN pattern database
  - Now correctly identifies Pathfinder, Maxima, Titan, Frontier, Murano, Sentra, GT-R, Leaf, and all other Nissan models
  - Modular architecture ensures fixes apply globally across all pages
  - Test results: JN1AR5EF8HM123456 → Pathfinder ✅, 1N6AD0CU8KN123456 → Titan ✅, JN1DA32A8ST123456 → Maxima ✅
- **Centralized VIN Decoder Architecture**: Implemented modular `decodeVinComprehensive()` function for consistent accuracy across all pages
- **Enhanced Model Selection Logic**: Prioritizes accurate Auto.dev API data over generic VIN patterns
- **Mercedes VIN Mapping**: Added precise W1K → CLA-Class mapping based on external validation
- **Database Cache Management**: Implemented cache clearing for legacy incorrect data
- **Ford Fusion Example**: VIN 3FA6P0HD1HR391819 now correctly returns "Fusion" with "SE" trim
- **Mercedes CLA Example**: VIN W1K5J8HB9PN334960 now correctly returns "CLA-Class" instead of "C-Class/E-Class"
- **Intelligent Trim Detection**: Implemented comprehensive VIN pattern-based trim detection as fallback when APIs don't provide trim data (August 26, 2025)
- **Nissan Trim Success**: VIN JN8BYZNY6P9400795 now correctly shows "Altima" model with "SV" trim via VIN pattern detection
- **SEO Enhancement**: Comprehensive Google optimization with sitemap.xml, robots.txt, Open Graph tags, Twitter Cards, and structured data markup (August 26, 2025)

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool.
- **UI**: shadcn/ui components (based on Radix UI primitives) and Tailwind CSS. The design system features a bold, brutalist style with black borders and colorful backgrounds.
- **State Management**: React Query (TanStack Query) for server state and caching.
- **Routing**: Wouter for lightweight client-side routing.
- **Form Handling**: React Hook Form with Zod for type-safe form management and validation.

### Backend Architecture
- **Server**: Express.js with TypeScript, providing RESTful API endpoints.
- **Database ORM**: Drizzle ORM for type-safe PostgreSQL database operations.
- **API Design**: RESTful VIN decoding endpoints with validation and error handling.
- **Build System**: ESBuild for server bundling.

### Database Schema
- **Tables**: `Users` (id, username, password) and `VIN Checks` (decoded VIN information, metadata).
- **Management**: Drizzle Kit for database migrations.
- **Validation**: Zod schemas for runtime data validation.

### Authentication & Authorization
- Basic user schema and password-based authentication foundation.
- Session management via `connect-pg-simple`.

### API Integration Strategy
- **Primary Data Source**: Auto.dev VIN Decoder API for comprehensive vehicle information.
- **Supplementary Data Source**: NHTSA API for specific model names.
- **Auction Data Source**: Vehicle Database API (api.vehicledatabases.com) for history, damage reports, and images.
- **API Security**: Backend wrapper functions abstract external API calls.
- **Payment Integration**: Full auction history and detailed reports are payment-gated via PayPal ($20).
- **Data Transformation**: Real-time currency conversion (USD to AED).
- **Error Handling**: Graceful fallbacks for unavailable data.
- **VIN Search Tracking**: User email, IP, user agent, and timestamp are logged for each VIN search. Automated email alerts are sent to support@carsclub.ae.
- **API Security Layer**: Token-based authentication for Vehicle Database API endpoints.
- **Admin Dashboard**: `/api/admin/vin-searches` endpoint for user analytics, requiring authentication.

### Security
- Production-grade security measures including AES-256-GCM data encryption with mandatory 16-byte authentication tag validation (prevents GCM forgery attacks), access control (admin authentication, IP whitelisting), HMAC signature validation, bearer tokens, request filtering (bot detection, rate limiting), and response obfuscation.
- Helmet security headers (XSS, CSRF, clickjacking protection).
- Endpoint-specific rate limiting (VIN: 10/15min, Contact: 3/hour, Payment: 5/hour).
- Input sanitization for XSS and SQL injection prevention.
- Production-safe error messages.
- Live Stripe integration with enforced `pk_live_` and `sk_live_` keys for production.
- CORS security with domain whitelisting.
- **Google Analytics & AdSense Security**: Removed hardcoded API keys from HTML and components, implemented secure environment variable-based dynamic loading (August 28, 2025).

### UI/UX Decisions
- Mobile-first responsive design.
- Consistent visual design across pages, using matching card layouts and hover effects.
- Google AdSense integration for monetization.

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon database connection for PostgreSQL.
- **drizzle-orm & drizzle-kit**: ORM and schema management.
- **@tanstack/react-query**: Server state management.
- **wouter**: Client-side routing.

### UI Component Libraries
- **@radix-ui/react-***: Accessible UI primitives.
- **shadcn/ui**: Component system built on Radix UI.
- **lucide-react**: Icon library.
- **tailwindcss**: CSS framework.

### Validation & Forms
- **zod**: Schema validation.
- **react-hook-form**: Form management.
- **@hookform/resolvers**: Form validation integration.

### Third-Party APIs
- **Auto.dev VIN Decoder API**: Primary VIN data.
- **NHTSA API**: Supplemental VIN data.
- **Vehicle Database API**: Auction history, damage reports, images.
- **Stripe**: Payment processing.
- **Nodemailer**: Email service.

### Development Tools
- **Vite**: Build tool.
- **TypeScript**: Static typing.
- **ESBuild**: JavaScript bundler.
- **PostCSS & Autoprefixer**: CSS processing.