import type { Request, Response, NextFunction } from 'express';
import { validateSession, ADMIN_IP_WHITELIST, generateHMAC, verifyHMAC } from './security';

// Extended request interface for authenticated requests
export interface AuthenticatedRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
  sessionToken?: string;
}

// Admin authentication middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const adminKey = req.headers['x-admin-key'] as string;
  const userIp = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Check if request comes from whitelisted IP (optional)
  if (process.env.NODE_ENV === 'production' && !ADMIN_IP_WHITELIST.includes(userIp)) {
    console.warn(`Admin access attempted from non-whitelisted IP: ${userIp}`);
  }
  
  // Validate admin key
  const expectedAdminKey = process.env.ADMIN_SECRET_KEY;
  if (!expectedAdminKey || !adminKey || adminKey !== expectedAdminKey) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  
  req.isAdmin = true;
  next();
}

// Session-based authentication middleware
export function requireSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');
  const userIp = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!sessionToken || !validateSession(sessionToken, userIp)) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
  
  req.sessionToken = sessionToken;
  next();
}

// API signature validation middleware
export function validateAPISignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-api-signature'] as string;
  const timestamp = req.headers['x-timestamp'] as string;
  const body = JSON.stringify(req.body);
  
  if (!signature || !timestamp) {
    return res.status(400).json({ message: 'Missing API signature or timestamp' });
  }
  
  // Check timestamp to prevent replay attacks (5 minute window)
  const requestTime = parseInt(timestamp);
  const currentTime = Date.now();
  const timeDiff = Math.abs(currentTime - requestTime);
  
  if (timeDiff > 5 * 60 * 1000) {
    return res.status(400).json({ message: 'Request timestamp too old' });
  }
  
  // Verify HMAC signature
  const payload = `${timestamp}:${body}`;
  const isValid = verifyHMAC(payload, signature);
  
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid API signature' });
  }
  
  next();
}

// Request logging middleware for security monitoring
export function securityLogger(req: Request, res: Response, next: NextFunction) {
  const userIp = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Log sensitive endpoint access
  const sensitiveEndpoints = ['/api/admin', '/api/create-payment-intent', '/api/vehicle-auction'];
  const isSensitive = sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint));
  
  if (isSensitive) {
    console.log(`[SECURITY] ${timestamp} - ${req.method} ${req.path} from ${userIp} (${userAgent})`);
  }
  
  next();
}

// Block suspicious requests while allowing search engines
export function blockSuspiciousRequests(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent']?.toLowerCase() || '';
  const userIp = req.ip || req.connection.remoteAddress || 'unknown';
  const requestPath = req.path;
  
  // Allow search engines and legitimate crawlers to access SEO files
  const seoFiles = ['/sitemap.xml', '/robots.txt', '/ads.txt'];
  const legitimateSearchBots = [
    /googlebot/i,          // Google crawler
    /bingbot/i,            // Bing crawler  
    /slurp/i,              // Yahoo crawler
    /duckduckbot/i,        // DuckDuckGo crawler
    /baiduspider/i,        // Baidu crawler
    /yandexbot/i,          // Yandex crawler
    /facebookexternalhit/i, // Facebook crawler
    /twitterbot/i,         // Twitter crawler
    /linkedinbot/i,        // LinkedIn crawler
    /applebot/i,           // Apple crawler
    /mediapartners-google/i // Google AdSense crawler
  ];
  
  // Allow legitimate search engine access to SEO files
  if (seoFiles.includes(requestPath)) {
    const isLegitimateBot = legitimateSearchBots.some(pattern => pattern.test(userAgent));
    if (isLegitimateBot) {
      return next(); // Allow legitimate search engines
    }
  }
  
  // Block known bot user agents (except legitimate search engines)
  const suspiciousUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'postman', 'insomnia', 
    'curl', 'wget', 'python-requests', 'go-http-client'
  ];
  
  const isSuspicious = suspiciousUserAgents.some(pattern => 
    userAgent.includes(pattern.toLowerCase())
  );
  
  const isLegitimateBot = legitimateSearchBots.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious && !isLegitimateBot && process.env.NODE_ENV === 'production') {
    console.warn(`[SECURITY] Blocked suspicious request from ${userIp} with User-Agent: ${userAgent}`);
    return res.status(403).json({ message: 'Access denied' });
  }
  
  next();
}

// Hide sensitive error information
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Application error:', err);
  
  // In production, don't expose error details
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ 
      message: 'Internal server error',
      error: 'ERR_INTERNAL_001'
    });
  } else {
    res.status(500).json({ 
      message: err.message,
      stack: err.stack 
    });
  }
}