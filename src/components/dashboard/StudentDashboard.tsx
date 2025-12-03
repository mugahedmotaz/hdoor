import { useState, useEffect } from "react";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/QRScanner";
import ProfessionalQRScanner from "@/components/ProfessionalQRScanner";
import AttendanceHistory from "@/components/AttendanceHistory";
import { QrCode, History } from "lucide-react";

interface StudentDashboardProps {
  userId: string;
}

// Normalize scanned QR text and extract payload
const extractQr = (raw: string): string => {
  let s = raw?.trim?.() ?? raw;
  // remove hidden RTL marks
  s = s.replace(/[\u200E\u200F\u202A-\u202E]/g, "");
  // decode URI if needed
  try { s = decodeURIComponent(s); } catch { }
  // if it's a URL, try to extract from query or last path segment
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      const byParam = u.searchParams.get("qr") || u.searchParams.get("code");
      if (byParam) return byParam.trim();
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length) return parts[parts.length - 1].trim();
    } catch { }
  }
  return s;
};

const StudentDashboard = ({ userId }: StudentDashboardProps) => {
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>("");
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

  useEffect(() => {
    initializeDevice();
  }, []);

  const initializeDevice = async () => {
    // Generate device fingerprint
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
    const hash = await generateHash(fingerprint);
    setDeviceFingerprint(hash);

    // Check if device is registered
    const existing = await dataClient.getDeviceBinding(userId, hash as string);
    if (existing) {
      setIsDeviceRegistered(true);
      // Update last used
      await dataClient.upsertDeviceBinding({
        user_id: userId,
        device_fingerprint: hash,
        device_name: navigator.userAgent.split("(")[1]?.split(")")[0] || "Unknown Device",
        last_used_at: new Date().toISOString(),
      });
      // Enforce exclusivity
      await dataClient.ensureExclusiveDevice(userId, hash, navigator.userAgent.split("(")[1]?.split(")")[0] || "Unknown Device");
    }
  };

  const generateHash = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const registerDevice = async () => {
    try {
      await dataClient.upsertDeviceBinding({
        user_id: userId,
        device_fingerprint: deviceFingerprint,
        device_name: navigator.userAgent.split("(")[1]?.split(")")[0] || "Unknown Device",
      });

      // Enforce exclusivity so هذا الجهاز يصبح الوحيد المفعّل
      await dataClient.ensureExclusiveDevice(
        userId,
        deviceFingerprint,
        navigator.userAgent.split("(")[1]?.split(")")[0] || "Unknown Device"
      );

      setIsDeviceRegistered(true);
      toast({
        title: "تم تسجيل الجهاز",
        description: "يمكنك الآن مسح الباركود للحضور",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    }
  };

  const handleScanResult = async (qrData: string) => {
    if (!isDeviceRegistered) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب تسجيل الجهاز أولاً",
      });
      return;
    }

    try {
      // Ensure current device is the only active device
      await dataClient.ensureExclusiveDevice(
        userId,
        deviceFingerprint,
        navigator.userAgent.split("(")[1]?.split(")")[0] || "Unknown Device"
      );

      // For professional QR scanner, the verification is done in the scanner component
      // Here we receive the verified lectureId directly
      const lecture = await dataClient.getLectureById(qrData);

      if (!lecture) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "المحاضرة غير موجودة",
        });
        return;
      }

      // Check if already attended
      const existingList = await dataClient.getAttendanceByStudent(userId);
      const already = existingList?.find((r: any) => r.lecture_id === lecture.id);
      if (already) {
        toast({
          variant: "destructive",
          title: "مسجل بالفعل",
          description: "لقد قمت بتسجيل حضورك في هذه المحاضرة مسبقاً",
        });
        return;
      }

      // Record attendance
      await dataClient.insertAttendance({
        lecture_id: lecture.id,
        student_id: userId,
        professor_id: lecture.professor_id,
        device_fingerprint: deviceFingerprint,
      });

      toast({
        title: "تم تسجيل الحضور بنجاح",
        description: `تم تسجيل حضورك في محاضرة: ${lecture.title}`,
      });

      setShowScanner(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>مسح الباركود</CardTitle>
                <CardDescription>سجل حضورك في المحاضرة</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isDeviceRegistered ? (
              <div className="text-center space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  يجب تسجيل جهازك أولاً لتتمكن من تسجيل الحضور
                </p>
                <Button onClick={registerDevice} className="w-full">
                  تسجيل الجهاز
                </Button>
              </div>
            ) : showScanner ? (
              <div className="space-y-4">
                <ProfessionalQRScanner
                  onScanSuccess={handleScanResult}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "خطأ في المسح",
                      description: error,
                    });
                  }}
                  professorId={userId}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(false)}
                  className="w-full"
                >
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowScanner(true)} className="w-full">
                فتح الماسح
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <History className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <CardTitle>سجل الحضور</CardTitle>
                <CardDescription>عرض سجل حضورك</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AttendanceHistory userId={userId} userType="student" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
