import { useState, useEffect } from "react";
import { dataClient } from "@/lib/dataClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProfessorManagement from "./ProfessorManagement";
import UniversitySettings from "./UniversitySettings";
import AttendanceStats from "./AttendanceStats";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, GraduationCap, BarChart3, Settings, Download, Bell, Shield, Database } from "lucide-react";

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
   const [professors, students, lectures, attendance, analytics] = await Promise.all([
    dataClient.getAllProfessors(),
    dataClient.getAllStudents(),
    dataClient.getAllLectures(),
    dataClient.getAllAttendance(),
    dataClient.getUniversityAnalytics(universityId),
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

 const handleBackup = async () => {
  try {
   const backup = await dataClient.createBackup(universityId);
   toast({
    title: "تم إنشاء نسخة احتياطية",
    description: `رقم النسخة: ${backup.backup_id}`,
   });
  } catch (error) {
   toast({
    variant: "destructive",
    title: "خطأ في النسخ الاحتياطي",
    description: "يرجى المحاولة مرة أخرى",
   });
  }
 };

 const handleReport = async (format: 'pdf' | 'excel') => {
  try {
   const report = await dataClient.generateAttendanceReport('all', format);
   toast({
    title: "تم إنشاء التقرير",
    description: `تنسيق: ${format.toUpperCase()}`,
   });
  } catch (error) {
   toast({
    variant: "destructive",
    title: "خطأ في إنشاء التقرير",
    description: "يرجى المحاولة مرة أخرى",
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
      <BarChart3 className="h-4 w-4 text-muted-foreground" />
     </CardHeader>
     <CardContent>
      <div className="text-2xl font-bold">{stats.totalLectures}</div>
      <p className="text-xs text-muted-foreground">إجمالي المحاضرات</p>
     </CardContent>
    </Card>
    <Card>
     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">سجلات الحضور</CardTitle>
      <Building2 className="h-4 w-4 text-muted-foreground" />
     </CardHeader>
     <CardContent>
      <div className="text-2xl font-bold">{stats.totalAttendance}</div>
      <p className="text-xs text-muted-foreground">إجمالي سجلات الحضور</p>
     </CardContent>
    </Card>
   </div>

   {/* Main Content */}
   <Tabs defaultValue="professors" className="space-y-4">
    <TabsList className="grid w-full grid-cols-4">
     <TabsTrigger value="professors">الأساتذة</TabsTrigger>
     <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
     <TabsTrigger value="settings">الإعدادات</TabsTrigger>
     <TabsTrigger value="tools">الأدوات</TabsTrigger>
    </TabsList>

    <TabsContent value="overview" className="space-y-4">
     {/* Quick Actions */}
     <Card>
      <CardHeader>
       <CardTitle>إجراءات سريعة</CardTitle>
       <CardDescription>إدارة الجامعة بسهولة</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
       <div className="flex flex-wrap gap-2">
        <Button onClick={handleBackup} className="gap-2">
         <Database className="w-4 h-4" />
         نسخ احتياطي
        </Button>
        <Button onClick={() => handleReport('pdf')} variant="outline" className="gap-2">
         <Download className="w-4 h-4" />
         تقرير PDF
        </Button>
        <Button onClick={() => handleReport('excel')} variant="outline" className="gap-2">
         <Download className="w-4 h-4" />
         تقرير Excel
        </Button>
       </div>
      </CardContent>
     </Card>
    </TabsContent>

    <TabsContent value="professors">
     <ProfessorManagement universityId={universityId} />
    </TabsContent>

    <TabsContent value="settings">
     <UniversitySettings universityId={universityId} adminId={adminId} />
    </TabsContent>

    <TabsContent value="tools" className="space-y-4">
     <Card>
      <CardHeader>
       <CardTitle className="flex items-center gap-2">
        <Shield className="w-5 h-5" />
        الأمان والسجلات
       </CardTitle>
      </CardHeader>
      <CardContent>
       <p className="text-muted-foreground">مراقبة الأمان وسجلات النظام</p>
      </CardContent>
     </Card>

     <Card>
      <CardHeader>
       <CardTitle className="flex items-center gap-2">
        <Bell className="w-5 h-5" />
        إدارة الإشعارات
       </CardTitle>
      </CardHeader>
      <CardContent>
       <p className="text-muted-foreground">إرسال إشعارات للمستخدمين</p>
      </CardContent>
     </Card>
    </TabsContent>
   </Tabs>
  </div>
 );
}
