import { useEffect, useState } from "react";
import { dataClient } from "@/lib/dataClient";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar } from "lucide-react";

interface AttendanceHistoryProps {
  userId: string;
  userType: "student" | "professor";
  lectureId?: string;
}

const AttendanceHistory = ({ userId, userType, lectureId }: AttendanceHistoryProps) => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [userId, lectureId]);

  const fetchAttendance = async () => {
    try {
      if (userType === "student") {
        const data = await dataClient.getAttendanceByStudent(userId);
        setAttendance(data || []);
      } else if (lectureId) {
        const data = await dataClient.getAttendanceByLectureIds([lectureId]);
        setAttendance(data || []);
      } else {
        // Get professor's lectures first
        const lecturesData = await dataClient.getLecturesByProfessor(userId);
        const lectureIds = lecturesData?.map((l: any) => l.id) || [];

        if (lectureIds.length > 0) {
          const data = await dataClient.getAttendanceByLectureIds(lectureIds);
          setAttendance(data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>;
  }

  if (attendance.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لا توجد سجلات حضور بعد
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {attendance.map((record) => (
          <div
            key={record.id}
            className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="p-2 bg-secondary/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1 space-y-1">
              {userType === "professor" && record.profiles && (
                <div className="font-medium">
                  {record.profiles.full_name}
                  <Badge variant="outline" className="mr-2">
                    {record.profiles.university_id}
                  </Badge>
                </div>
              )}
              {record.lectures && (
                <div className="text-sm">
                  <span className="font-medium text-primary">
                    {record.lectures.course_code}
                  </span>
                  {" - "}
                  {record.lectures.title}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(record.scanned_at), "PPp", { locale: ar })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AttendanceHistory;
