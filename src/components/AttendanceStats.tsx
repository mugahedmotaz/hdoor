import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { dataClient } from "@/lib/dataClient";

interface AttendanceStatsProps {
 lectureId: string;
 totalStudents?: number;
 isActive?: boolean;
}

interface AttendanceRecord {
 student_id: string;
 scanned_at: string;
 profiles?: {
  full_name: string;
  university_id: string;
 };
}

export default function AttendanceStats({ lectureId, totalStudents = 0, isActive = false }: AttendanceStatsProps) {
 const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
 const [loading, setLoading] = useState(true);

 // Real data fetching from database
 useEffect(() => {
  const fetchAttendance = async () => {
   setLoading(true);
   try {
    const attendanceData = await dataClient.getAttendanceByLecture(lectureId);
    console.log('AttendanceStats - Fetched attendance:', attendanceData); // Debug log
    setAttendance(attendanceData || []);
   } catch (error) {
    console.error('Failed to fetch attendance:', error);
    setAttendance([]);
   } finally {
    setLoading(false);
   }
  };

  fetchAttendance();

  // Set up real-time updates if lecture is active
  let interval: number;
  if (isActive) {
   interval = window.setInterval(fetchAttendance, 3000); // Update every 3 seconds
  }

  return () => {
   if (interval) clearInterval(interval);
  };
 }, [lectureId, isActive]);

 const attendanceCount = attendance.length;
 const attendanceRate = totalStudents > 0 ? (attendanceCount / totalStudents) * 100 : 0;
 const recentAttendance = attendance.filter(record => {
  const scanTime = new Date(record.scanned_at);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return scanTime > fiveMinutesAgo;
 }).length;

 if (loading) {
  return (
   <Card className="w-full">
    <CardHeader>
     <CardTitle className="flex items-center gap-2">
      <Users className="w-5 h-5" />
      إحصائيات الحضور
     </CardTitle>
    </CardHeader>
    <CardContent>
     <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w1/2" />
     </div>
    </CardContent>
   </Card>
  );
 }

 return (
  <Card className="w-full shadow-elegant">
   <CardHeader>
    <CardTitle className="flex items-center justify-between">
     <div className="flex items-center gap-2">
      <Users className="w-5 h-5" />
      إحصائيات الحضور
     </div>
     <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "نشط" : "منتهي"}
     </Badge>
    </CardTitle>
   </CardHeader>
   <CardContent className="space-y-6">
    {/* Main Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     <div className="text-center">
      <div className="text-2xl font-bold text-primary">{attendanceCount}</div>
      <div className="text-sm text-muted-foreground">الحاضرين</div>
     </div>
     <div className="text-center">
      <div className="text-2xl font-bold text-green-600">{attendanceRate.toFixed(1)}%</div>
      <div className="text-sm text-muted-foreground">نسبة الحضور</div>
     </div>
     <div className="text-center">
      <div className="text-2xl font-bold text-orange-600">{recentAttendance}</div>
      <div className="text-sm text-muted-foreground">آخر 5 دقائق</div>
     </div>
    </div>

    {/* Progress Bar */}
    {totalStudents > 0 && (
     <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
       <span>معدل الحضور</span>
       <span>{attendanceCount} / {totalStudents}</span>
      </div>
      <Progress value={attendanceRate} className="h-2" />
     </div>
    )}

    {/* Recent Activity */}
    <div className="space-y-2">
     <div className="flex items-center gap-2 text-sm font-medium">
      <TrendingUp className="w-4 h-4" />
      النشاط الحديث
     </div>
     <div className="space-y-1 max-h-32 overflow-y-auto">
      {attendance.slice(0, 5).map((record, index) => (
       <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
        <div className="flex items-center gap-2">
         <span className="font-medium">{record.student_name || 'طالب'}</span>
         {record.university_id && (
          <span className="text-muted-foreground">({record.university_id})</span>
         )}
        </div>
        <span className="text-muted-foreground">
         {new Date(record.scanned_at).toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit'
         })}
        </span>
       </div>
      ))}
      {attendance.length === 0 && (
       <div className="text-center text-muted-foreground py-4">
        لا يوجد سجل حضور بعد
       </div>
      )}
     </div>
    </div>

    {/* Alerts */}
    {attendanceRate < 50 && attendanceCount > 0 && (
     <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <AlertTriangle className="w-4 h-4 text-orange-600" />
      <span className="text-sm text-orange-800">
       نسبة الحضور منخفضة ({attendanceRate.toFixed(1)}%)
      </span>
     </div>
    )}

    {isActive && attendanceCount === 0 && (
     <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Clock className="w-4 h-4 text-blue-600" />
      <span className="text-sm text-blue-800">
       في انتظار تسجيل الحضور...
      </span>
     </div>
    )}
   </CardContent>
  </Card>
 );
}
