// Simple HMAC-SHA256 using Web Crypto for signing rotating QR payloads
// Note: In a real production app, secrets must stay server-side. Client-side secret is visible.

const textEncoder = new TextEncoder();

async function importKey(secret: string) {
 return crypto.subtle.importKey(
  "raw",
  textEncoder.encode(secret),
  { name: "HMAC", hash: { name: "SHA-256" } },
  false,
  ["sign", "verify"]
 );
}

export function getQrSecret(): string | null {
 // Vite exposes env as import.meta.env.VITE_*
 const raw = (import.meta as any).env?.VITE_QR_SECRET as string | undefined;
 return raw && raw.length > 0 ? raw : null;
}

export function getWindowCounter(intervalMs: number): number {
 return Math.floor(Date.now() / intervalMs);
}

export async function hmacHex(input: string, secret: string): Promise<string> {
 const key = await importKey(secret);
 const sig = await crypto.subtle.sign("HMAC", key, textEncoder.encode(input));
 return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function signPayload(base: string, windowCounter: number, secret: string): Promise<string> {
 return hmacHex(`${base}|${windowCounter}`, secret);
}

export async function verifyPayload(base: string, windowCounter: number, signature: string, secret: string): Promise<boolean> {
 const expected = await signPayload(base, windowCounter, secret);
 return expected === signature;
}
