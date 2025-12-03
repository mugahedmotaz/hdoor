// Crypto utilities for secure QR payload and HMAC verification
// Using native Web Crypto API for better security and no external dependencies

// Generate cryptographically secure random string
export function generateSecureRandom(length = 16): string {
 const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let result = '';
 const randomValues = new Uint8Array(length);
 crypto.getRandomValues(randomValues);
 for (let i = 0; i < length; i++) {
  result += chars[randomValues[i] % chars.length];
 }
 return result;
}

// Simple HMAC-like implementation using native crypto
async function hmacSha256(message: string, key: string): Promise<string> {
 const encoder = new TextEncoder();
 const keyData = encoder.encode(key);
 const messageData = encoder.encode(message);

 const cryptoKey = await crypto.subtle.importKey(
  'raw',
  keyData,
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign']
 );

 const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
 const hashArray = Array.from(new Uint8Array(signature));
 return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create signed QR payload with timestamp and HMAC
export async function createSecureQRPayload(lectureId: string, secretKey: string): Promise<string> {
 const timestamp = Date.now();
 const nonce = generateSecureRandom(8);
 const payload = `${lectureId}|${timestamp}|${nonce}`;
 const signature = await hmacSha256(payload, secretKey);
 return `${payload}:${signature}`;
}

// Verify QR payload signature and freshness (max 15 seconds old)
export async function verifySecureQRPayload(payloadWithSig: string, secretKey: string): Promise<{ lectureId: string; valid: boolean; reason?: string }> {
 try {
  const [payload, signature] = payloadWithSig.split(':');
  if (!payload || !signature) return { lectureId: '', valid: false, reason: 'Invalid format' };

  // Verify signature
  const expectedSig = await hmacSha256(payload, secretKey);
  if (signature !== expectedSig) return { lectureId: '', valid: false, reason: 'Invalid signature' };

  // Parse payload
  const [lectureId, timestampStr] = payload.split('|');
  const timestamp = parseInt(timestampStr, 10);
  if (!lectureId || isNaN(timestamp)) return { lectureId: '', valid: false, reason: 'Malformed payload' };

  // Check freshness (within 15 seconds)
  const now = Date.now();
  const age = now - timestamp;
  if (age < 0 || age > 15000) return { lectureId: '', valid: false, reason: 'Expired' };

  return { lectureId, valid: true };
 } catch (e) {
  return { lectureId: '', valid: false, reason: 'Verification error' };
 }
}

// Helper to generate a per-lecture secret key (in production, store server-side)
export function getLectureSecretKey(lectureId: string, professorId: string): string {
 // In production, derive from a server-side secret; for demo, use deterministic key
 return `LECTURE_SECRET_${professorId}_${lectureId}`;
}
