import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifySecureQRPayload, getLectureSecretKey } from "@/lib/cryptoUtils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ProfessionalQRScannerProps {
 onScanSuccess: (lectureId: string) => void;
 onError?: (error: string) => void;
 professorId?: string; // for secret key derivation
}

export default function ProfessionalQRScanner({ onScanSuccess, onError, professorId }: ProfessionalQRScannerProps) {
 const { toast } = useToast();
 const scannerRef = useRef<Html5Qrcode | null>(null);
 const isScanning = useRef(false);

 useEffect(() => {
  const startScanner = async () => {
   if (isScanning.current) return;

   try {
    const scanner = new Html5Qrcode("qr-reader-professional");
    scannerRef.current = scanner;
    isScanning.current = true;

    await scanner.start(
     { facingMode: "environment" },
     {
      fps: 15,
      qrbox: { width: 250, height: 250 },
     },
     async (decodedText) => {
      await handleScanResult(decodedText);
      stopScanner();
     },
     (error) => {
      // Silent scan errors are normal
     }
    );
   } catch (error) {
    console.error("Error starting scanner:", error);
    toast({
     variant: "destructive",
     title: "خطأ في تشغيل الكاميرا",
     description: "يرجى التأكد من صلاحيات الكاميرا والمحاولة مرة أخرى",
    });
    isScanning.current = false;
   }
  };

  const stopScanner = async () => {
   if (scannerRef.current && isScanning.current) {
    try {
     await scannerRef.current.stop();
     scannerRef.current.clear();
    } catch (error) {
     console.error("Error stopping scanner:", error);
    } finally {
     isScanning.current = false;
    }
   }
  };

  const handleScanResult = async (decodedText: string) => {
   try {
    // Normalize and clean scanned data
    let cleaned = decodedText?.trim?.() ?? decodedText;
    cleaned = cleaned.replace(/[\u200E\u200F\u202A-\u202E]/g, ""); // remove RTL marks
    try { cleaned = decodeURIComponent(cleaned); } catch { }

    // Try to extract QR from URL if applicable
    if (/^https?:\/\//i.test(cleaned)) {
     try {
      const u = new URL(cleaned);
      const byParam = u.searchParams.get("qr") || u.searchParams.get("code");
      if (byParam) cleaned = byParam.trim();
      else {
       const parts = u.pathname.split("/").filter(Boolean);
       if (parts.length) cleaned = parts[parts.length - 1].trim();
      }
     } catch { }
    }

    // Verify secure QR payload
    // Note: In production, secret key should be fetched server-side per lecture
    // For demo, we'll try to derive if professorId is provided
    if (!professorId) {
     toast({
      variant: "destructive",
      title: "خطأ في التحقق",
      description: "لا يمكن التحقق من الباركود بدون معرّف الأستاذ",
     });
     return;
    }

    // Extract lectureId from QR to derive secret key
    const parts = cleaned.split('|');
    if (parts.length < 2) {
     toast({
      variant: "destructive",
      title: "باركود غير صالح",
      description: "التنسيق غير مدعوم",
     });
     return;
    }
    const lectureId = parts[0];
    const secretKey = getLectureSecretKey(lectureId, professorId);

    const verification = await verifySecureQRPayload(cleaned, secretKey);
    if (!verification.valid) {
     toast({
      variant: "destructive",
      title: "فشل التحقق من الباركود",
      description: verification.reason || "باركود غير صالح",
     });
     onError?.(verification.reason || "Invalid QR");
     return;
    }

    // Success
    toast({
     title: "تم التحقق من الباركود",
     description: "باركود صالح وآمن",
    });
    onScanSuccess(verification.lectureId);
   } catch (error: any) {
    console.error("Scan processing error:", error);
    toast({
     variant: "destructive",
     title: "خطأ في معالجة الباركود",
     description: error.message || "حدث خطأ غير متوقع",
    });
    onError?.(error.message || "Processing error");
   }
  };

  startScanner();

  return () => {
   stopScanner();
  };
 }, [toast, onScanSuccess, onError, professorId]);

 return (
  <div className="w-full max-w-sm mx-auto space-y-3">
   <Alert className="border-blue-200 bg-blue-50/50">
    <Shield className="h-4 w-4 text-blue-600" />
    <AlertDescription className="text-blue-800 text-sm">
     امسح الباركود الآمن. يتم التحقق من التوقيع والصلاحية تلقائياً.
    </AlertDescription>
   </Alert>

   <div
    id="qr-reader-professional"
    className="w-full h-64 rounded-lg overflow-hidden border-2 border-primary/20 bg-white"
   />

   <div className="text-xs text-center text-muted-foreground space-y-1">
    <div className="flex items-center justify-center gap-2">
     <CheckCircle className="w-3 h-3 text-green-600" />
     <span>تشفير HMAC</span>
    </div>
    <div className="flex items-center justify-center gap-2">
     <Clock className="w-3 h-3 text-orange-600" />
     <span>صلاحية 15 ثانية</span>
    </div>
    <div className="flex items-center justify-center gap-2">
     <Shield className="w-3 h-3 text-blue-600" />
     <span>حماية من إعادة الاستخدام</span>
    </div>
   </div>
  </div>
 );
}
