import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanResult: (result: string) => void;
}

const QRScanner = ({ onScanResult }: QRScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  useEffect(() => {
    const startScanner = async () => {
      if (isScanning.current) return;
      
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        isScanning.current = true;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanResult(decodedText);
            stopScanner();
          },
          (error) => {
            console.log("QR scan error:", error);
          }
        );
      } catch (error) {
        console.error("Error starting scanner:", error);
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

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScanResult]);

  return (
    <div className="w-full">
      <div
        id="qr-reader"
        className="w-full rounded-lg overflow-hidden border-2 border-primary/20"
      />
    </div>
  );
};

export default QRScanner;
