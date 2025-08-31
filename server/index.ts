import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { SECURITY_HEADERS, RATE_LIMITS } from "./security";

const app = express();

// Environment check for CI builds
const isCIBuild = process.env.CI === 'true' || process.env.NODE_ENV === 'test';

// Trust proxy for proper IP detection (required for Replit deployment)
app.set('trust proxy', true);

// Enhanced security middleware with caching optimizations
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["https://js.stripe.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Performance optimization: Comprehensive caching and compression

// Enable gzip compression for all responses
app.use(compression({
  level: 6, // Good balance of compression vs CPU usage
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Advanced caching strategy with proper ETags
app.use((req, res, next) => {
  // Static assets - cache for 1 year with immutable flag
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    // Enable ETag for better caching
    res.setHeader('ETag', `"${Date.now()}"`);
  }
  // HTML files - cache for 5 minutes with revalidation
  else if (req.url.match(/\.html$/) || req.url === '/') {
    res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
    res.setHeader('ETag', `"html-${Date.now()}"`);
  }
  // API responses - no cache for dynamic content
  else if (req.url.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Apply security headers
app.use((req, res, next) => {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // CORS security headers
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['https://carsclub.ae', 'http://localhost:5000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key, X-API-Signature');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Enhanced rate limiting with different limits per endpoint
const vinDecodeRateLimit = rateLimit({
  ...RATE_LIMITS.VIN_DECODE,
  skip: (req) => process.env.NODE_ENV === 'development'
});
const contactFormRateLimit = rateLimit({
  ...RATE_LIMITS.CONTACT_FORM,
  skip: (req) => process.env.NODE_ENV === 'development'
});
const paymentRateLimit = rateLimit({
  ...RATE_LIMITS.PAYMENT,
  skip: (req) => process.env.NODE_ENV === 'development'
});
const adminRateLimit = rateLimit({
  ...RATE_LIMITS.ADMIN,
  skip: (req) => process.env.NODE_ENV === 'development'
});
const defaultRateLimit = rateLimit({
  ...RATE_LIMITS.DEFAULT,
  skip: (req) => process.env.NODE_ENV === 'development'
});

// Apply rate limiting to specific endpoints
app.use('/api/vin/decode', vinDecodeRateLimit);
app.use('/api/contact', contactFormRateLimit);
app.use('/api/create-payment-intent', paymentRateLimit);
app.use('/api/admin', adminRateLimit);
app.use('/api', defaultRateLimit);

// Move security middleware import to top
import { securityLogger, blockSuspiciousRequests, errorHandler } from "./authMiddleware";

app.use(express.json({ limit: '1mb' })); // Reduced limit for security
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Apply security middleware
app.use(securityLogger);
app.use(blockSuspiciousRequests);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add error handler middleware as the last middleware
app.use(errorHandler);

(async () => {
  // Force production security checks
  if (process.env.NODE_ENV === 'production') {
    console.log('[SECURITY] Application starting in PRODUCTION mode with enhanced security');
    
    // Verify all required security environment variables
    const requiredEnvVars = ['ENCRYPTION_KEY', 'HMAC_SECRET', 'ADMIN_SECRET_KEY'];
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
      console.error(`[SECURITY] Missing required environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('[SECURITY] Application starting in DEVELOPMENT mode');
  }

  const server = await registerRoutes(app);

  // Specific route for ads.txt with proper content type
  app.get('/ads.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.sendFile(path.resolve('public/ads.txt'));
  });

  // Specific route for sitemap.xml with proper content type and search engine access
  app.get('/sitemap.xml', (req, res) => {
    // Allow search engines to access sitemap without restrictions
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for sitemap
    res.setHeader('X-Robots-Tag', 'noindex'); // Don't index the sitemap itself
    res.removeHeader('X-Frame-Options'); // Remove restrictive frame options for sitemap
    res.sendFile(path.resolve('public/sitemap.xml'));
  });

  // Specific route for robots.txt with proper content type and search engine access
  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for robots.txt
    res.setHeader('X-Robots-Tag', 'noindex'); // Don't index robots.txt itself
    res.removeHeader('X-Frame-Options'); // Remove restrictive frame options
    res.sendFile(path.resolve('public/robots.txt'));
  });

  // Serve static files from public directory BEFORE Vite middleware
  app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.txt')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      } else if (path.endsWith('.xml')) {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      } else if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.webp')) {
        if (path.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (path.endsWith('.webp')) {
          res.setHeader('Content-Type', 'image/webp');
        } else {
          res.setHeader('Content-Type', 'image/jpeg');
        }
      }
    }
  }));

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🔒 Secure VIN Checker Server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
    if (process.env.NODE_ENV === 'production') {
      console.log('[SECURITY] Production security measures active:');
      console.log('  ✓ Helmet security headers enabled');
      console.log('  ✓ Rate limiting active');
      console.log('  ✓ Data encryption enabled');
      console.log('  ✓ Admin authentication required');
      console.log('  ✓ API signature validation enabled');
      console.log('  ✓ Suspicious request blocking active');
    }
  });
})();
