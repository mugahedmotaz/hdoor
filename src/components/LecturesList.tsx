import { useEffect, useState, useRef } from "react";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AttendanceHistory from "@/components/AttendanceHistory";
import QRCode from "qrcode";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { QrCode, Users, MapPin, Calendar, Download } from "lucide-react";

interface LecturesListProps {
  userId: string;
  refreshKey: number;
}

const LecturesList = ({ userId, refreshKey }: LecturesListProps) => {
  const { toast } = useToast();
  const [lectures, setLectures] = useState<any[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchLectures();
  }, [userId, refreshKey]);

  const fetchLectures = async () => {
    try {
      const data = await dataClient.getLecturesByProfessor(userId);
      setLectures(data || []);
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
  };

  const generateQRCode = async (lecture: any) => {
    try {
      const url = await QRCode.toDataURL(lecture.qr_code_data, {
        width: 400,
        margin: 2,
        color: {
          dark: "#1e3a8a",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(url);
      setSelectedLecture(lecture);
      setShowQR(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في توليد الباركود",
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl || !selectedLecture) return;

    const link = document.createElement("a");
    link.download = `qr-${selectedLecture.course_code}-${selectedLecture.id}.png`;
    link.href = qrCodeUrl;
    link.click();

    toast({
      title: "تم التحميل",
      description: "تم تحميل الباركود بنجاح",
    });
  };

  const viewAttendance = (lecture: any) => {
    setSelectedLecture(lecture);
    setShowAttendance(true);
  };

  return (
    <>
      <div className="space-y-4">
        {lectures.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لم تقم بإنشاء أي محاضرات بعد
          </div>
        ) : (
          lectures.map((lecture) => (
            <Card key={lecture.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {lecture.title}
                      <Badge variant={lecture.is_active ? "default" : "secondary"}>
                        {lecture.is_active ? "نشط" : "منتهي"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <span className="font-medium text-primary">{lecture.course_code}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  {lecture.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {lecture.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(lecture.start_time), "PPp", { locale: ar })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => generateQRCode(lecture)}
                    className="gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    عرض الباركود
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => viewAttendance(lecture)}
                    className="gap-2"
                  >
                    <Users className="w-4 h-4" />
                    الحضور
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              باركود المحاضرة
            </DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg">{selectedLecture.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedLecture.course_code}
                </p>
              </div>
              <div className="flex justify-center bg-white p-6 rounded-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-xs" />
              </div>
              <Button onClick={downloadQRCode} className="w-full gap-2">
                <Download className="w-4 h-4" />
                تحميل الباركود
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAttendance} onOpenChange={setShowAttendance}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>سجل الحضور</DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <AttendanceHistory
              userId={userId}
              userType="professor"
              lectureId={selectedLecture.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LecturesList;
