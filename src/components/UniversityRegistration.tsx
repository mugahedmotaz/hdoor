import { useState } from "react";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Lock, User, CheckCircle } from "lucide-react";

interface UniversityRegistrationProps {
 onUniversityCreated: (universityId: string) => void;
}

export default function UniversityRegistration({ onUniversityCreated }: UniversityRegistrationProps) {
 const { toast } = useToast();
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  universityName: "",
  adminEmail: "",
  adminPassword: "",
 });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   // Create university admin account with minimal info
   const result = await dataClient.signUp(
    formData.adminEmail,
    formData.adminPassword,
    "مدير الجامعة",
    "ADMIN001",
    "admin"
   );

   if (result.error) {
    console.error("SignUp error:", result.error);
    throw new Error(result.error.message || "فشل في إنشاء حساب المدير");
   }

   if (!result?.data?.user || !result.data.user.id) {
    throw new Error("فشل في إنشاء حساب المدير - لم يتم إرجاع المستخدم");
   }

   const user = result.data.user;

   // Create university record
   await dataClient.createUniversity({
    id: user.id,
    name: formData.universityName,
    admin_id: user.id,
    is_active: true,
   });

   toast({
    title: "تم إنشاء الجامعة بنجاح",
    description: "يمكنك الآن تسجيل الدخول وإدارة الأساتذة والطلاب",
   });

   onUniversityCreated(user.id);
  } catch (error: any) {
   console.error("UniversityRegistration error:", error);
   toast({
    variant: "destructive",
    title: "خطأ في إنشاء الجامعة",
    description: error.message || "يرجى المحاولة مرة أخرى",
   });
  } finally {
   setLoading(false);
  }
 };

 return (
  <Card className="w-full max-w-md mx-auto shadow-elegant">
   <CardHeader className="text-center">
    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
     <Building2 className="w-6 h-6 text-primary" />
    </div>
    <CardTitle className="text-xl">تسجيل جامعة جديدة</CardTitle>
    <CardDescription>
     فقط البريد الإلكتروني وكلمة المرور المطلوبين
    </CardDescription>
   </CardHeader>
   <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4">
     <div className="space-y-2">
      <Label htmlFor="universityName">اسم الجامعة</Label>
      <Input
       id="universityName"
       value={formData.universityName}
       onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
       placeholder="جامعة المملكة"
       required
       dir="rtl"
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="adminEmail">البريد الإلكتروني</Label>
      <Input
       id="adminEmail"
       type="email"
       value={formData.adminEmail}
       onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
       placeholder="admin@university.edu"
       required
       dir="ltr"
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="adminPassword">كلمة المرور</Label>
      <Input
       id="adminPassword"
       type="password"
       value={formData.adminPassword}
       onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
       placeholder="••••••••"
       required
       minLength={6}
      />
     </div>

     <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "جاري الإنشاء..." : "إنشاء جامعة"}
     </Button>
    </form>

    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
     <div className="flex items-start gap-2">
      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
      <div className="text-sm text-blue-800">
       <p className="font-medium mb-1">بعد التسجيل:</p>
       <ul className="text-xs space-y-1">
        <li>• تسجيل الدخول كمدير جامعة</li>
        <li>• إضافة وتعيين الأساتذة</li>
        <li>• إدارة الطلاب والمحاضرات</li>
        <li>• متابعة إحصائيات الحضور</li>
       </ul>
      </div>
     </div>
    </div>
   </CardContent>
  </Card>
 );
}
