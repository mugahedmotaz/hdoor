import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { dataClient } from "@/lib/dataClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";

interface AttendanceRecordProps {
  lectureId: string;
  professorId: string;
  onAttendanceUpdate?: (count: number) => void;
}

export default function AttendanceRecord({
  lectureId,
  professorId,
  onAttendanceUpdate
}: AttendanceRecordProps) {
  const { toast } = useToast();
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const attendance = await dataClient.getAttendanceByLecture(lectureId);
      setAttendanceList(attendance || []);
      onAttendanceUpdate?.(attendance?.length || 0);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast({
        variant: "destructive",
        title: "خطأ في جلب سجل الحضور",
        description: "يرجى المحاولة مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual attendance entry
  const handleManualEntry = async () => {
    if (!manualCode.trim()) {
      toast({
        variant: "destructive",
        title: "حقل مطلوب",
        description: "يرجى إدخال كود الطالب",
      });
      return;
    }

    try {
      // Find student by university ID
      const students = await dataClient.getAllStudents();
      const student = students.find(s => s.university_id === manualCode.trim());

      if (!student) {
        toast({
          variant: "destructive",
          title: "طالب غير موجود",
          description: "لم يتم العثور على طالب بهذا الكود",
        });
        return;
      }

      // Check if already marked
      const existing = attendanceList.find(a => a.student_id === student.id);
      if (existing) {
        toast({
          variant: "destructive",
          title: "مسجل بالفعل",
          description: "هذا الطالب مسجل حضوره بالفعل",
        });
        return;
      }

      // Record attendance
      await dataClient.insertAttendance({
        lecture_id: lectureId,
        student_id: student.id,
        professor_id: "", // Manual entry doesn't have professor context
        device_fingerprint: "manual_entry",
      });

      toast({
        title: "تم تسجيل الحضور",
        description: `تم تسجيل حضور الطالب: ${student.full_name}`,
      });

      setManualCode("");
      setShowManualEntry(false);
      fetchAttendance(); // Refresh list
    } catch (error) {
      console.error("Error recording manual attendance:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الحضور",
        description: "يرجى المحاولة مرة أخرى",
      });
    }
  };

  // Filter attendance based on search
  const filteredAttendance = attendanceList.filter(attendance => {
    const student = attendance.profiles;
    if (!student) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      student.full_name?.toLowerCase().includes(searchLower) ||
      student.university_id?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchAttendance();
  }, [lectureId]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            سجل الحضور
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {attendanceList.length} حاضر
            </Badge>
            <Button
              size="sm"
              onClick={() => setShowManualEntry(!showManualEntry)}
              variant={showManualEntry ? "default" : "outline"}
            >
              تسجيل يدوي
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manual Entry Form */}
        {showManualEntry && (
          <Alert className="border-blue-200 bg-blue-50/50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="manual-code">كود الطالب (الرقم الجامعي)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="manual-code"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="أدخل الرقم الجامعي"
                      className="flex-1"
                    />
                    <Button onClick={handleManualEntry} disabled={!manualCode.trim()}>
                      تسجيل
                    </Button>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو الرقم الجامعي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Attendance List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            جاري تحميل سجل الحضور...
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "لا توجد نتائج للبحث" : "لا يوجد سجل حضور بعد"}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAttendance.map((attendance) => {
              const student = attendance.profiles;
              if (!student) return null;

              return (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">{student.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.university_id}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">
                      {new Date(attendance.scanned_at).toLocaleTimeString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {attendance.device_fingerprint === "manual_entry"
                        ? "تسجيل يدوي"
                        : "مسح ضوئي"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={fetchAttendance}
            disabled={loading}
            className="w-full"
          >
            <Clock className="w-4 h-4 mr-2" />
            تحديث السجل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
