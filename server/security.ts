import crypto from 'crypto';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';

// Security configuration
export const SECURITY_CONFIG = {
  ADMIN_SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
  API_TOKEN_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  HMAC_ALGORITHM: 'sha256',
  GCM_AUTH_TAG_LENGTH: 16 // 128 bits for GCM authentication tag
};

// Generate secure encryption key from environment
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || 'fallback-key-for-development-only-not-secure';
  return crypto.scryptSync(key, 'salt', 32);
}

// Encrypt sensitive data
export function encryptData(data: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv) as crypto.CipherGCM;
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Ensure authentication tag is the expected length for security
    if (authTag.length !== SECURITY_CONFIG.GCM_AUTH_TAG_LENGTH) {
      console.error('Generated GCM authentication tag has unexpected length:', authTag.length);
      return '';
    }
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
}

// Decrypt sensitive data
export function decryptData(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    if (parts.length !== 3) return '';
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    // Validate authentication tag length to prevent GCM attacks
    if (authTag.length !== SECURITY_CONFIG.GCM_AUTH_TAG_LENGTH) {
      console.error('Invalid GCM authentication tag length:', authTag.length, 'expected:', SECURITY_CONFIG.GCM_AUTH_TAG_LENGTH);
      return '';
    }
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv) as crypto.DecipherGCM;
    // Set authentication tag with validated length (16 bytes = 128 bits)
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

// Generate secure random tokens
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Hash sensitive data with salt
export async function hashWithSalt(data: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(data, saltRounds);
}

// Verify hashed data
export async function verifyHash(data: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(data, hash);
}

// Generate HMAC signature for API requests
export function generateHMAC(data: string, secret?: string): string {
  const key = secret || process.env.HMAC_SECRET || 'fallback-hmac-secret';
  return crypto.createHmac(SECURITY_CONFIG.HMAC_ALGORITHM, key)
                .update(data)
                .digest('hex');
}

// Verify HMAC signature
export function verifyHMAC(data: string, signature: string, secret?: string): boolean {
  const expectedSignature = generateHMAC(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.stripe.com;
    frame-src https://js.stripe.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim(),
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

// IP whitelist for admin access
export const ADMIN_IP_WHITELIST = [
  '127.0.0.1',
  '::1',
  // Add specific IP addresses for admin access
];

// Obfuscate sensitive response data
export function obfuscateResponse(data: any): any {
  if (typeof data !== 'object' || data === null) return data;
  
  const obfuscated = { ...data };
  
  // Remove or obfuscate sensitive fields
  const sensitiveFields = ['email', 'ip', 'userAgent', 'createdAt', 'updatedAt', 'id', 'squishVin', 'checkDigit'];
  
  sensitiveFields.forEach(field => {
    if (field in obfuscated) {
      if (field === 'email' && obfuscated[field]) {
        const email = obfuscated[field];
        const [username, domain] = email.split('@');
        obfuscated[field] = `${username.charAt(0)}***@${domain}`;
      } else if (field === 'ip' && obfuscated[field]) {
        obfuscated[field] = '***.***.***.**';
      } else if (field === 'id') {
        // Replace database ID with safe placeholder
        obfuscated[field] = 'protected';
      } else {
        // Delete sensitive fields completely
        delete obfuscated[field];
      }
    }
  });
  
  return obfuscated;
}

// Rate limiting configuration
export const RATE_LIMITS = {
  VIN_DECODE: { windowMs: 15 * 60 * 1000, max: 10 }, // 10 requests per 15 minutes
  CONTACT_FORM: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 requests per hour
  PAYMENT: { windowMs: 60 * 60 * 1000, max: 5 }, // 5 payments per hour
  ADMIN: { windowMs: 15 * 60 * 1000, max: 20 }, // 20 requests per 15 minutes for admin
  DEFAULT: { windowMs: 15 * 60 * 1000, max: 100 } // 100 requests per 15 minutes default
};

// Session management
interface Session {
  token: string;
  userId: string;
  createdAt: number;
  lastAccess: number;
  ipAddress: string;
}

const activeSessions = new Map<string, Session>();

export function createSession(userId: string, ipAddress: string): string {
  const token = generateSecureToken();
  const session: Session = {
    token,
    userId,
    createdAt: Date.now(),
    lastAccess: Date.now(),
    ipAddress
  };
  
  activeSessions.set(token, session);
  return token;
}

export function validateSession(token: string, ipAddress: string): boolean {
  const session = activeSessions.get(token);
  if (!session) return false;
  
  const now = Date.now();
  
  // Check if session is expired
  if (now - session.lastAccess > SECURITY_CONFIG.ADMIN_SESSION_DURATION) {
    activeSessions.delete(token);
    return false;
  }
  
  // Check if IP address matches (optional, can be disabled for dynamic IPs)
  if (session.ipAddress !== ipAddress) {
    console.warn(`Session IP mismatch: ${session.ipAddress} vs ${ipAddress}`);
  }
  
  // Update last access time
  session.lastAccess = now;
  activeSessions.set(token, session);
  
  return true;
}

export function invalidateSession(token: string): void {
  activeSessions.delete(token);
}

// Clean up expired sessions
setInterval(() => {
  const now = Date.now();
  activeSessions.forEach((session, token) => {
    if (now - session.lastAccess > SECURITY_CONFIG.ADMIN_SESSION_DURATION) {
      activeSessions.delete(token);
    }
  });
}, 60 * 1000); // Clean up every minute