import { useEffect, useRef, useState } from "react";
import { createSecureQRPayload, getLectureSecretKey } from "@/lib/cryptoUtils";
import { dataClient } from "@/lib/dataClient";

interface QRCodeWithLogoProps {
 lectureId: string;
 professorId: string;
 universityId: string;
 className?: string;
}

export default function QRCodeWithLogo({
 lectureId,
 professorId,
 universityId,
 className = ""
}: QRCodeWithLogoProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [qrUrl, setQrUrl] = useState<string>("");

 useEffect(() => {
  const generateQR = async () => {
   try {
    const secretKey = getLectureSecretKey(lectureId, professorId);
    const payload = createSecureQRPayload(lectureId, secretKey);

    // Generate QR code using canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code placeholder (you should use a proper QR library)
    canvas.width = 256;
    canvas.height = 256;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);

    // Draw QR pattern (simplified)
    ctx.fillStyle = '#000000';
    const cellSize = 8;
    for (let i = 0; i < 32; i++) {
     for (let j = 0; j < 32; j++) {
      if (Math.random() > 0.5) {
       ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
     }
    }

    // Add university logo placeholder in center
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(96, 96, 64, 64);
    ctx.fillStyle = '#3b82f6';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HDOOR', 128, 128);

    const url = canvas.toDataURL();
    setQrUrl(url);
   } catch (error) {
    console.error("Error generating QR code:", error);
   }
  };

  generateQR();
 }, [lectureId, professorId, universityId]);

 return (
  <div className={`relative ${className}`}>
   {qrUrl ? (
    <img
     src={qrUrl}
     alt="QR Code"
     className="w-48 h-48 sm:w-56 sm:h-56 max-w-full"
    />
   ) : (
    <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gray-200 animate-pulse rounded flex items-center justify-center max-w-full">
     <div className="text-gray-400 text-center">
      <div className="w-8 h-8 mx-auto mb-2">⏳</div>
      <span className="text-sm">جاري التوليد...</span>
     </div>
    </div>
   )}
   <canvas ref={canvasRef} className="hidden" />
  </div>
 );
}