// Security and Data Protection System
import { supabase } from "@/integrations/supabase/client";

export interface SecurityConfig {
 maxLoginAttempts: number;
 lockoutDuration: number; // in minutes
 sessionTimeout: number; // in minutes
 requireDeviceBinding: boolean;
 enforceLocationCheck: boolean;
 allowedIPRanges: string[];
}

export const defaultSecurityConfig: SecurityConfig = {
 maxLoginAttempts: 5,
 lockoutDuration: 15,
 sessionTimeout: 60,
 requireDeviceBinding: true,
 enforceLocationCheck: false,
 allowedIPRanges: [],
};

export class SecurityManager {
 private config: SecurityConfig;
 private userId: string | null;

 constructor(config: SecurityConfig = defaultSecurityConfig, userId?: string) {
  this.config = config;
  this.userId = userId || null;
 }

 // Rate limiting for login attempts
 async checkLoginAttempts(email: string): Promise<{ allowed: boolean; remainingAttempts: number; lockedUntil?: Date }> {
  try {
   // For now, use a simple approach since security_logs table doesn't exist yet
   // In production, this would query the security_logs table
   const attempts = 0; // Placeholder
   const remainingAttempts = Math.max(0, this.config.maxLoginAttempts - attempts);

   return { allowed: true, remainingAttempts };
  } catch (error) {
   console.error('Error checking login attempts:', error);
   // Allow login if we can't check attempts
   return { allowed: true, remainingAttempts: this.config.maxLoginAttempts };
  }
 }

 // Log security events
 async logSecurityEvent(eventType: string, eventData: any, ipAddress?: string, userAgent?: string): Promise<void> {
  if (!this.userId) return;

  try {
   // For now, just log to console since security_logs table doesn't exist yet
   console.log('Security Event:', { userId: this.userId, eventType, eventData, ipAddress, userAgent });
  } catch (error) {
   console.error('Error logging security event:', error);
  }
 }

 // Validate device binding
 async validateDeviceBinding(deviceFingerprint: string): Promise<boolean> {
  if (!this.userId || !this.config.requireDeviceBinding) {
   return true;
  }

  try {
   const { data, error } = await supabase
    .from('device_bindings')
    .select('is_active, last_used_at')
    .eq('user_id', this.userId)
    .eq('device_fingerprint', deviceFingerprint)
    .eq('is_active', true)
    .single();

   if (error || !data) {
    await this.logSecurityEvent('device_binding_invalid', { deviceFingerprint });
    return false;
   }

   // Update last used time
   await supabase
    .from('device_bindings')
    .update({ last_used_at: new Date().toISOString() })
    .eq('user_id', this.userId)
    .eq('device_fingerprint', deviceFingerprint);

   return true;
  } catch (error) {
   console.error('Error validating device binding:', error);
   return false;
  }
 }

 // Check session timeout
 async checkSessionTimeout(lastActivity: Date): Promise<boolean> {
  const now = new Date();
  const timeDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60); // minutes

  if (timeDiff > this.config.sessionTimeout) {
   await this.logSecurityEvent('session_timeout', { lastActivity: lastActivity.toISOString() });
   return false;
  }

  return true;
 }

 // Validate IP address (if configured)
 validateIPAddress(ipAddress: string): boolean {
  if (this.config.allowedIPRanges.length === 0) {
   return true;
  }

  // Simple IP range validation (in production, use a proper IP range library)
  return this.config.allowedIPRanges.some(range => {
   if (range.includes('/')) {
    // CIDR notation - simplified check
    const [baseIP, mask] = range.split('/');
    return ipAddress.startsWith(baseIP.slice(0, baseIP.lastIndexOf('.')));
   } else {
    // Exact IP match
    return ipAddress === range;
   }
  });
 }

 // Generate secure random token
 generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
   result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
 }

 // Hash sensitive data (simplified - use proper hashing in production)
 async hashData(data: string): Promise<string> {
  // In production, use bcrypt or similar
  return btoa(data + Date.now().toString());
 }

 // Validate input data
 sanitizeInput(input: string): string {
  return input
   .trim()
   .replace(/[<>]/g, '') // Remove potential HTML tags
   .replace(/['"]/g, '') // Remove quotes
   .substring(0, 1000); // Limit length
 }

 // Check for suspicious activity patterns
 async detectSuspiciousActivity(userId: string): Promise<{
  suspicious: boolean;
  reasons: string[];
  riskScore: number;
 }> {
  const reasons: string[] = [];
  let riskScore = 0;

  try {
   // For now, simplified since security_logs table doesn't exist yet
   // In production, this would query security_logs table
   const deviceBindings = await supabase
    .from('device_bindings')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

   if (deviceBindings.data && deviceBindings.data.length > 2) {
    reasons.push('Multiple device bindings');
    riskScore += 20;
   }

   return {
    suspicious: riskScore > 40,
    reasons,
    riskScore: Math.min(riskScore, 100),
   };
  } catch (error) {
   console.error('Error detecting suspicious activity:', error);
   return { suspicious: false, reasons: [], riskScore: 0 };
  }
 }

 // Encrypt sensitive data (simplified - use proper encryption in production)
 encryptData(data: string): string {
  // In production, use proper encryption libraries
  return btoa(data);
 }

 // Decrypt sensitive data
 decryptData(encryptedData: string): string {
  try {
   return atob(encryptedData);
  } catch (error) {
   console.error('Error decrypting data:', error);
   return '';
  }
 }

 // Validate QR code authenticity
 async validateQRCode(qrData: string, lectureId: string): Promise<boolean> {
  try {
   // Check if QR code matches expected format
   const expectedPattern = `${lectureId}|`;
   if (!qrData.startsWith(expectedPattern)) {
    return false;
   }

   // Check time window (5 seconds)
   const parts = qrData.split('|');
   const timeWindow = parseInt(parts[1]);
   const currentWindow = Math.floor(Date.now() / 5000);

   if (Math.abs(currentWindow - timeWindow) > 1) {
    return false;
   }

   // Verify lecture exists and is active
   const { data: lecture } = await supabase
    .from('lectures')
    .select('is_active, start_time, end_time')
    .eq('id', lectureId)
    .single();

   if (!lecture || !lecture.is_active) {
    return false;
   }

   // Check if lecture is within valid time range
   const now = new Date();
   const startTime = new Date(lecture.start_time);
   const endTime = new Date(lecture.end_time);

   return now >= startTime && now <= endTime;
  } catch (error) {
   console.error('Error validating QR code:', error);
   return false;
  }
 }

 // Rate limiting for API calls
 private apiCallCounts = new Map<string, { count: number; resetTime: number }>();

 checkRateLimit(identifier: string, maxCalls: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = this.apiCallCounts.get(identifier);

  if (!record || now > record.resetTime) {
   this.apiCallCounts.set(identifier, { count: 1, resetTime: now + windowMs });
   return true;
  }

  if (record.count >= maxCalls) {
   return false;
  }

  record.count++;
  return true;
 }

 // Cleanup old rate limit records
 cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of this.apiCallCounts.entries()) {
   if (now > record.resetTime) {
    this.apiCallCounts.delete(key);
   }
  }
 }
}

// React Hook for security
export function useSecurity(config?: SecurityConfig, userId?: string) {
 return new SecurityManager(config, userId);
}

// Middleware for API security
export function securityMiddleware(config: SecurityConfig = defaultSecurityConfig) {
 const securityManager = new SecurityManager(config);

 return async (req: any, res: any, next: any) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  // Rate limiting
  if (!securityManager.checkRateLimit(clientIP)) {
   return res.status(429).json({ error: 'Too many requests' });
  }

  // IP validation
  if (!securityManager.validateIPAddress(clientIP)) {
   await securityManager.logSecurityEvent('ip_blocked', { ip: clientIP });
   return res.status(403).json({ error: 'Access denied from this IP' });
  }

  // Check for suspicious activity
  if (req.user?.id) {
   const { suspicious, reasons } = await securityManager.detectSuspiciousActivity(req.user.id);
   if (suspicious) {
    await securityManager.logSecurityEvent('suspicious_activity', { reasons });
    // In production, you might want to implement additional security measures
   }
  }

  next();
 };
}

// Utility functions
export function generateDeviceFingerprint(): string {
 const canvas = document.createElement('canvas');
 const ctx = canvas.getContext('2d');
 if (ctx) {
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
 }

 const fingerprint = [
  navigator.userAgent,
  navigator.language,
  screen.width + 'x' + screen.height,
  new Date().getTimezoneOffset(),
  canvas.toDataURL()
 ].join('|');

 return btoa(fingerprint).substring(0, 32);
}

export function validateEmail(email: string): boolean {
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return emailRegex.test(email);
}

export function validatePassword(password: string): {
 isValid: boolean;
 errors: string[];
} {
 const errors: string[] = [];

 if (password.length < 8) {
  errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
 }

 if (!/[A-Z]/.test(password)) {
  errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
 }

 if (!/[a-z]/.test(password)) {
  errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
 }

 if (!/[0-9]/.test(password)) {
  errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
 }

 if (!/[!@#$%^&*]/.test(password)) {
  errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
 }

 return {
  isValid: errors.length === 0,
  errors,
 };
}
