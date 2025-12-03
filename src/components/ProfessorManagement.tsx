import { useState, useEffect } from "react";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Mail, Lock, Edit, Trash2, CheckCircle } from "lucide-react";

interface ProfessorManagementProps {
 universityId: string;
}

export default function ProfessorManagement({ universityId }: ProfessorManagementProps) {
 const { toast } = useToast();
 const [professors, setProfessors] = useState<any[]>([]);
 const [loading, setLoading] = useState(false);
 const [showAddForm, setShowAddForm] = useState(false);
 const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  universityId: "",
  password: "",
 });

 const fetchProfessors = async () => {
  try {
   const profList = await dataClient.getAllProfessors();
   setProfessors(Array.isArray(profList) ? profList : []);
  } catch (error) {
   console.error("Error fetching professors:", error);
   setProfessors([]);
  }
 };

 const handleAddProfessor = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   // Create professor account
   const result = await dataClient.signUp(
    formData.email,
    formData.password,
    formData.fullName,
    formData.universityId,
    "professor"
   );

   if (!result?.data?.user) {
    throw new Error("فشل في إنشاء حساب الأستاذ");
   }

   toast({
    title: "تم إضافة الأستاذ بنجاح",
    description: `تم إنشاء حساب للأستاذ: ${formData.fullName}`,
   });

   setFormData({
    fullName: "",
    email: "",
    universityId: "",
    password: "",
   });
   setShowAddForm(false);
   fetchProfessors();
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في إضافة الأستاذ",
    description: error.message || "يرجى المحاولة مرة أخرى",
   });
  } finally {
   setLoading(false);
  }
 };

 const handleResetPassword = async (professorId: string, email: string) => {
  if (!professorId || !email) {
   toast({
    variant: "destructive",
    title: "خطأ",
    description: "بيانات الأستاذ غير مكتملة",
   });
   return;
  }

  try {
   const tempPassword = Math.random().toString(36).slice(-8);
   await dataClient.resetUserPassword(professorId, tempPassword);
   toast({
    title: "تم إعادة تعيين كلمة المرور",
    description: `كلمة المرور الجديدة: ${tempPassword}`,
   });
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في إعادة تعيين كلمة المرور",
    description: error.message,
   });
  }
 };

 const handleDeleteProfessor = async (professorId: string) => {
  if (!confirm("هل أنت متأكد من حذف هذا الأستاذ؟")) return;

  if (!professorId) {
   toast({
    variant: "destructive",
    title: "خطأ",
    description: "معرف الأستاذ غير موجود",
   });
   return;
  }

  try {
   await dataClient.deleteUser(professorId);
   toast({
    title: "تم حذف الأستاذ",
    description: "تم حذف حساب الأستاذ بنجاح",
   });
   fetchProfessors();
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في حذف الأستاذ",
    description: error.message,
   });
  }
 };

 useEffect(() => {
  fetchProfessors();
 }, []);

 return (
  <div className="space-y-6">
   <Card>
    <CardHeader>
     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
       <Users className="w-5 h-5" />
       <CardTitle className="text-lg sm:text-xl">إدارة الأساتذة</CardTitle>
      </div>
      <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
       <UserPlus className="w-4 h-4 mr-2" />
       إضافة أستاذ
      </Button>
     </div>
     <CardDescription>
      إضافة وإدارة حسابات الأساتذة في الجامعة
     </CardDescription>
    </CardHeader>
    <CardContent>
     {showAddForm && (
      <Card className="mb-6 border-2 border-primary/20">
       <CardHeader className="pb-4">
        <CardTitle className="text-lg">إضافة أستاذ جديد</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
        <form onSubmit={handleAddProfessor} className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
           <Label htmlFor="fullName">الاسم الكامل</Label>
           <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="د. أحمد محمد"
            required
            dir="rtl"
           />
          </div>
          <div className="space-y-2">
           <Label htmlFor="universityId">الرقم الوظيفي</Label>
           <Input
            id="universityId"
            value={formData.universityId}
            onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
            placeholder="PROF001"
            required
            dir="ltr"
           />
          </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
           <Label htmlFor="email">البريد الإلكتروني</Label>
           <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="professor@university.edu"
            required
            dir="ltr"
           />
          </div>
          <div className="space-y-2">
           <Label htmlFor="password">كلمة المرور</Label>
           <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            minLength={6}
           />
          </div>
         </div>
         <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
           {loading ? "جاري الإضافة..." : "إضافة أستاذ"}
          </Button>
          <Button
           type="button"
           variant="outline"
           onClick={() => setShowAddForm(false)}
           className="w-full sm:w-auto"
          >
           إلغاء
          </Button>
         </div>
        </form>
       </CardContent>
      </Card>
     )}

     <div className="space-y-4">
      {professors.length === 0 ? (
       <div className="text-center py-8 sm:py-12 text-muted-foreground">
        <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
        <p className="text-base sm:text-lg">لا يوجد أساتذة بعد</p>
        <p className="text-sm sm:text-base mt-2">اضغط على "إضافة أستاذ" للبدء</p>
       </div>
      ) : (
       professors.map((professor) => (
        <Card key={professor?.id || 'unknown'} className="hover:shadow-md transition-shadow">
         <CardContent className="p-3 sm:p-4">
          <div className="space-y-4">
           {/* Professor Info */}
           <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
             <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
             <h3 className="font-medium truncate">{professor?.full_name || 'غير معروف'}</h3>
             <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
              <span className="truncate">{professor?.university_id || 'N/A'}</span>
              <span className="hidden sm:inline">•</span>
              <span className="truncate">{professor?.email || 'N/A'}</span>
             </div>
            </div>
           </div>

           {/* Actions */}
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Badge variant="secondary" className="w-fit">أستاذ</Badge>
            <div className="flex gap-2 flex-wrap">
             <Button
              size="sm"
              variant="outline"
              className="text-xs px-2 py-1 h-8"
              onClick={() => professor?.id && handleResetPassword(professor.id, professor.email || '')}
             >
              <Lock className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">إعادة تعيين</span>
              <span className="sm:hidden">تعيين</span>
             </Button>
             <Button
              size="sm"
              variant="destructive"
              className="text-xs px-2 py-1 h-8"
              onClick={() => professor?.id && handleDeleteProfessor(professor.id)}
             >
              <Trash2 className="w-3 h-3" />
             </Button>
            </div>
           </div>
          </div>
         </CardContent>
        </Card>
       ))
      )}
     </div>
    </CardContent>
   </Card>
  </div>
 );
}
