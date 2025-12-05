import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { Logo } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPasswordComplete() {
 const navigate = useNavigate();
 const { toast } = useToast();
 const [loading, setLoading] = useState(false);
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [done, setDone] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== confirmPassword) {
   toast({
    variant: "destructive",
    title: "كلمتا المرور غير متطابقتين",
    description: "يرجى التأكد من تطابق كلمة المرور والتأكيد",
   });
   return;
  }

  setLoading(true);
  try {
   const { error } = await supabase.auth.updateUser({ password });
   if (error) throw error;

   setDone(true);
   toast({
    title: "تم تحديث كلمة المرور",
    description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
   });
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في تحديث كلمة المرور",
    description: error.message || "يرجى المحاولة مرة أخرى",
   });
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-background">
   <Header showAuthButtons={false} />
   <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
    <Card className="w-full max-w-md shadow-elegant">
     <CardHeader className="text-center space-y-2">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
       <Lock className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl font-bold">تعيين كلمة مرور جديدة</CardTitle>
      <Logo size="xl" className="m-auto" />
      <CardDescription>
       أدخل كلمة مرور جديدة لحسابك
      </CardDescription>
     </CardHeader>
     <CardContent>
      {!done ? (
       <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
         <Label htmlFor="password">كلمة المرور الجديدة</Label>
         <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
         />
        </div>

        <div className="space-y-2">
         <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
         <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
         />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
         {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
        </Button>
       </form>
      ) : (
       <div className="text-center space-y-4 py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
         <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-600">تم تحديث كلمة المرور بنجاح</h3>
        <Button onClick={() => navigate("/auth")} className="w-full">
         العودة لتسجيل الدخول
        </Button>
       </div>
      )}

      <div className="text-center mt-6">
       <Button variant="ghost" onClick={() => navigate("/auth")} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        العودة لتسجيل الدخول
       </Button>
      </div>
     </CardContent>
    </Card>
   </div>
  </div>
 );
}
