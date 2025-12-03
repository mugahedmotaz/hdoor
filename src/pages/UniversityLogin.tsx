import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import { Logo } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { dataClient } from "@/lib/dataClient";

export default function UniversityLogin() {
 const navigate = useNavigate();
 const { toast } = useToast();
 const [loading, setLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   const { data, error } = await dataClient.signIn(email, password);

   if (error) {
    toast({
     variant: "destructive",
     title: "خطأ في تسجيل الدخول",
     description: error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    });
    return;
   }

   if (data?.user) {
    toast({
     title: "مرحباً مدير الجامعة",
     description: "تم تسجيل الدخول بنجاح",
    });
    navigate("/dashboard");
   }
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في تسجيل الدخول",
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
       <Building2 className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl font-bold">تسجيل دخول الجامعة</CardTitle>
      <Logo size="xl" className="m-auto" />
      <CardDescription>
       تسجيل الدخول مخصص لمديري الجامعات فقط
      </CardDescription>
     </CardHeader>
     <CardContent>
      <form onSubmit={handleLogin} className="space-y-4">
       <div className="space-y-2">
        <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
        <div className="relative">
         <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
         <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@university.edu"
          className="pr-10"
          dir="ltr"
          required
         />
        </div>
       </div>

       <div className="space-y-2">
        <Label htmlFor="password" className="text-right">كلمة المرور</Label>
        <div className="relative">
         <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
         <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="pl-10"
          dir="ltr"
          required
         />
         <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-3 top-2 h-6 w-6 p-0"
          onClick={() => setShowPassword(!showPassword)}
         >
          {showPassword ? (
           <EyeOff className="h-4 w-4" />
          ) : (
           <Eye className="h-4 w-4" />
          )}
         </Button>
        </div>
       </div>

       <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
         <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
          جاري التحميل...
         </>
        ) : (
         <>
          <LogIn className="w-4 h-4 ml-2" />
          تسجيل الدخول
         </>
        )}
       </Button>
      </form>

      <div className="text-center space-y-2 mt-6">
       <Button variant="link" onClick={() => navigate("/forgot-password")}>
        نسيت كلمة المرور؟
       </Button>
       <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="w-3 h-3" />
        <span>للمديرين المعتمدين فقط</span>
       </div>
      </div>

      <div className="text-center">
       <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        العودة للصفحة الرئيسية
       </Button>
      </div>
     </CardContent>
    </Card>
   </div>
  </div>
 );
}