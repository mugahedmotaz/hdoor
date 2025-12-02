import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getQrSecret, getWindowCounter, signPayload } from "@/lib/qr";

interface QRCodeDisplayProps {
 baseData: string;
 refreshIntervalMs?: number; // default 5000
 size?: number; // px, default 320
}

// Generates a rotating QR payload every interval window using a simple time window counter
// format: `${baseData}|${window}` where window = Math.floor(Date.now()/interval)
export default function QRCodeDisplay({ baseData, refreshIntervalMs = 5000, size = 320 }: QRCodeDisplayProps) {
 const [url, setUrl] = useState<string>("");
 const [timeLeft, setTimeLeft] = useState<number>(Math.ceil(refreshIntervalMs / 1000));
 const intervalRef = useRef<number | null>(null);
 const countdownRef = useRef<number | null>(null);

 const generate = async () => {
  try {
   const secret = getQrSecret();
   const windowCounter = getWindowCounter(refreshIntervalMs);
   let payload: string;

   if (secret) {
    const sig = await signPayload(baseData, windowCounter, secret);
    payload = `${baseData}|${windowCounter}|${sig}`;
   } else {
    // fallback (غير مُوقّع) إن لم يضبط السر
    payload = `${baseData}|${windowCounter}`;
    if (import.meta.env.DEV) {
     // eslint-disable-next-line no-console
     console.warn("VITE_QR_SECRET غير مضبوط. الكود سيُولّد بدون توقيع HMAC.");
    }
   }
   const dataUrl = await QRCode.toDataURL(payload, {
    width: size,
    margin: 2,
    color: { dark: "#1e3a8a", light: "#ffffff" },
   });
   setUrl(dataUrl);
   setTimeLeft(Math.ceil(refreshIntervalMs / 1000));
  } catch (e) {
   console.error("QR generate error", e);
  }
 };

 useEffect(() => {
  generate();
  if (intervalRef.current) window.clearInterval(intervalRef.current);
  intervalRef.current = window.setInterval(generate, refreshIntervalMs);
  return () => {
   if (intervalRef.current) window.clearInterval(intervalRef.current);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [baseData, refreshIntervalMs]);

 useEffect(() => {
  if (countdownRef.current) window.clearInterval(countdownRef.current);
  countdownRef.current = window.setInterval(() => {
   setTimeLeft((t) => (t <= 1 ? Math.ceil(refreshIntervalMs / 1000) : t - 1));
  }, 1000);
  return () => {
   if (countdownRef.current) window.clearInterval(countdownRef.current);
  };
 }, [refreshIntervalMs]);

 return (
  <div className="text-center space-y-3">
   <div className="bg-white p-4 rounded-lg inline-block">
    {url ? (
     <img src={url} alt="QR Code" className="w-64 h-64 mx-auto" />
    ) : (
     <div className="w-64 h-64 bg-gray-200 animate-pulse rounded" />
    )}
   </div>
   <div className="text-sm text-muted-foreground">يتجدد خلال {timeLeft} ثانية</div>
  </div>
 );
}
