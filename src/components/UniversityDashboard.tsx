import { useState, useEffect } from "react";
import { dataClient } from "@/lib/dataClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessorManagement from "./ProfessorManagement";
import UniversitySettings from "./UniversitySettings";
import AttendanceStats from "./AttendanceStats";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, GraduationCap, BarChart3, Settings } from "lucide-react";

interface UniversityDashboardProps {
 universityId: string;
 adminId: string;
}

export default function UniversityDashboard({ universityId, adminId }: UniversityDashboardProps) {
 const { toast } = useToast();
 const [stats, setStats] = useState({
  totalProfessors: 0,
  totalStudents: 0,
  totalLectures: 0,
  totalAttendance: 0,
 });

 const fetchStats = async () => {
  try {
   const [professors, students, lectures, attendance] = await Promise.all([
    dataClient.getAllProfessors(),
    dataClient.getAllStudents(),
    dataClient.getAllLectures(),
    dataClient.getAllAttendance(),
   ]);

   setStats({
    totalProfessors: Array.isArray(professors) ? professors.length : 0,
    totalStudents: Array.isArray(students) ? students.length : 0,
    totalLectures: Array.isArray(lectures) ? lectures.length : 0,
    totalAttendance: Array.isArray(attendance) ? attendance.length : 0,
   });
  } catch (error) {
   console.error("Error fetching stats:", error);
   setStats({
    totalProfessors: 0,
    totalStudents: 0,
    totalLectures: 0,
    totalAttendance: 0,
   });
  }
 };

 useEffect(() => {
  fetchStats();
 }, []);

 return (
  <div className="space-y-6">
   {/* Stats Cards */}
   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">الأساتذة</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
     </CardHeader>
     <CardContent>
      <div className="text-2xl font-bold">{stats.totalProfessors}</div>
      <p className="text-xs text-muted-foreground">إجمالي الأساتذة</p>
     </CardContent>
    </Card>
    <Card>
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">الطلاب</CardTitle>
      <GraduationCap className="h-4 w-4 text-muted-foreground" />
     </CardHeader>
     <CardContent>
      <div className="text-2xl font-bold">{stats.totalStudents}</div>
      <p className="text-xs text-muted-foreground">إجمالي الطلاب</p>
     </CardContent>
    </Card>
    <Card>
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">المحاضرات</CardTitle>
      <Settings className="h-4 w-4 text-muted-foreground" />
     </CardHeader>
     <CardContent>
      <div className="text-2xl font-bold">{stats.totalLectures}</div>
      <p className="text-xs text-muted-foreground">إجمالي المحاضرات</p>
     </CardContent>
    </Card>
    <Card>
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">سجلات الحضور</CardTitle>
      <BarChart3 className="h-4 w-4 text-muted-foreground" />
     </CardHeader>
     <CardContent>
      <div className="text-2xl font-bold">{stats.totalAttendance}</div>
      <p className="text-xs text-muted-foreground">إجمالي سجلات الحضور</p>
     </CardContent>
    </Card>
   </div>

   {/* Main Content */}
   <Tabs defaultValue="professors" className="space-y-4">
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
     <TabsTrigger value="professors" className="flex items-center gap-2 text-sm">
      <Users className="w-4 h-4" />
      <span className="hidden sm:inline">الأساتذة</span>
      <span className="sm:hidden">أساتذة</span>
     </TabsTrigger>
     <TabsTrigger value="students" className="flex items-center gap-2 text-sm">
      <GraduationCap className="w-4 h-4" />
      <span className="hidden sm:inline">الطلاب</span>
      <span className="sm:hidden">طلاب</span>
     </TabsTrigger>
     <TabsTrigger value="attendance" className="flex items-center gap-2 text-sm">
      <BarChart3 className="w-4 h-4" />
      <span className="hidden sm:inline">الإحصائيات</span>
      <span className="sm:hidden">إحصائيات</span>
     </TabsTrigger>
     <TabsTrigger value="settings" className="flex items-center gap-2 text-sm">
      <Settings className="w-4 h-4" />
      <span className="hidden sm:inline">الإعدادات</span>
      <span className="sm:hidden">إعدادات</span>
     </TabsTrigger>
    </TabsList>

    <TabsContent value="professors">
     <ProfessorManagement universityId={universityId} />
    </TabsContent>

    <TabsContent value="students">
     <Card>
      <CardHeader>
       <CardTitle>إدارة الطلاب</CardTitle>
       <CardDescription>
        عرض وإدارة حسابات الطلاب في الجامعة
       </CardDescription>
      </CardHeader>
      <CardContent>
       <div className="text-center py-8 text-muted-foreground">
        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>إدارة الطلاب قيد التطوير</p>
        <p className="text-sm">سيتم إضافة ميزات إدارة الطلاب قريباً</p>
       </div>
      </CardContent>
     </Card>
    </TabsContent>

    <TabsContent value="attendance">
     <Card>
      <CardHeader>
       <CardTitle>إحصائيات الحضور</CardTitle>
       <CardDescription>
        متابعة إحصائيات الحضور عبر الجامعة
       </CardDescription>
      </CardHeader>
      <CardContent>
       <div className="text-center py-8 text-muted-foreground">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>الإحصائيات المتقدمة قيد التطوير</p>
        <p className="text-sm">سيتم إضافة تقارير وتحليلات مفصلة قريباً</p>
       </div>
      </CardContent>
     </Card>
    </TabsContent>

    <TabsContent value="settings">
     <UniversitySettings universityId={universityId} adminId={adminId} />
    </TabsContent>
   </Tabs>
  </div>
 );
}
