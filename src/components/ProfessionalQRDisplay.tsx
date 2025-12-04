import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { createSecureQRPayload, getLectureSecretKey } from "@/lib/cryptoUtils";
import { dataClient } from "@/lib/dataClient";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeWithLogo from "./QRCodeWithLogo";

interface ProfessionalQRDisplayProps {
 lectureId: string;
 professorId: string;
 universityId: string;
 title: string;
 courseCode: string;
 refreshIntervalMs?: number;
 size?: number;
}

export default function ProfessionalQRDisplay({
 lectureId,
 professorId,
 universityId,
 title,
 courseCode,
 refreshIntervalMs = 5000,
 size = 320,
}: ProfessionalQRDisplayProps) {
 const { toast } = useToast();
 const [qrUrl, setQrUrl] = useState<string>("");
 const [timeLeft, setTimeLeft] = useState<number>(Math.ceil(refreshIntervalMs / 1000));
 const [isActive, setIsActive] = useState<boolean>(true);
 const [secretKey, setSecretKey] = useState<string>("");
 const intervalRef = useRef<number | null>(null);
 const countdownRef = useRef<number | null>(null);

 // Initialize secret key
 useEffect(() => {
  const key = getLectureSecretKey(lectureId, professorId);
  setSecretKey(key);
 }, [lectureId, professorId]);

 // Generate secure QR
 const generateSecureQR = async () => {
  if (!secretKey) return;
  try {
   const payload = await createSecureQRPayload(lectureId, secretKey);
   const dataUrl = await QRCode.toDataURL(payload, {
    width: 256, // Fixed size for better mobile compatibility
    margin: 2,
    color: { dark: "#1e3a8a", light: "#ffffff" },
    errorCorrectionLevel: "H",
   });
   setQrUrl(dataUrl);
   setTimeLeft(Math.ceil(refreshIntervalMs / 1000));
   setIsActive(true);
  } catch (e) {
   console.error("QR generation error", e);
   toast({
    variant: "destructive",
    title: "خطأ في توليد الباركود",
    description: "يرجى المحاولة مرة أخرى",
   });
  }
 };


 // Start rotation
 useEffect(() => {
  generateSecureQR();
  if (intervalRef.current) window.clearInterval(intervalRef.current);
  intervalRef.current = window.setInterval(generateSecureQR, refreshIntervalMs);

  if (countdownRef.current) window.clearInterval(countdownRef.current);
  countdownRef.current = window.setInterval(() => {
   setTimeLeft((t) => (t <= 1 ? Math.ceil(refreshIntervalMs / 1000) : t - 1));
  }, 1000);

  return () => {
   if (intervalRef.current) window.clearInterval(intervalRef.current);
   if (countdownRef.current) window.clearInterval(countdownRef.current);
  };
 }, [secretKey, refreshIntervalMs]);

 const progressPercent = ((refreshIntervalMs / 1000 - timeLeft) / (refreshIntervalMs / 1000)) * 100;

 return (
  <Card className="w-full max-w-sm mx-auto shadow-elegant">
   <CardContent className="p-4 space-y-3">
    {/* Header */}
    <div className="text-center space-y-1">
     <h3 className="font-bold text-base">{title}</h3>
     <p className="text-xs text-muted-foreground">{courseCode}</p>
     <div className="flex items-center justify-center gap-1">
      <Badge variant={isActive ? "default" : "secondary"} className="gap-1 text-xs px-2 py-0.5">
       {isActive ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
       {isActive ? "نشط" : "غير نشط"}
      </Badge>
      <Badge variant="outline" className="gap-1 text-xs px-2 py-0.5">
       <Shield className="w-3 h-3" />
       آمن
      </Badge>
     </div>
    </div>

    {/* QR Code with University Logo */}
    <div className="flex justify-center">
     <QRCodeWithLogo
      lectureId={lectureId}
      professorId={professorId}
      universityId={universityId}
      className="shadow-lg"
     />
    </div>

    {/* Progress & Timer */}
    <div className="space-y-2">
     <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">يتجدد خلال</span>
      <span className="font-mono font-bold">{timeLeft}s</span>
     </div>
     <Progress value={progressPercent} className="h-1.5" />
    </div>


    {/* Security Note */}
    <div className="text-xs text-center text-muted-foreground">
     الباركود محمي بتوقيت زمني وتشفير لمنع الاحتيال
    </div>
   </CardContent>
  </Card>
 );
}
