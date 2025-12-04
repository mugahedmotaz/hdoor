import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Logo } from "@/components/ui/avatar";
import Header from "@/components/Header";

export default function ForgotPassword() {
 const navigate = useNavigate();
 const { toast } = useToast();
 const [loading, setLoading] = useState(false);
 const [email, setEmail] = useState("");
 const [submitted, setSubmitted] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   // Find user by email
   const users = JSON.parse(localStorage.getItem('users') || '[]');
   const user = users.find((u: any) => u.email === email);

   if (!user) {
    toast({
     variant: "destructive",
     title: "البريد الإلكتروني غير موجود",
     description: "لم يتم العثور على حساب بهذا البريد الإلكتروني",
    });
    return;
   }

   // Generate temporary password
   const tempPassword = Math.random().toString(36).slice(-8);

   // Update user password
   const updatedUsers = users.map((u: any) =>
    u.email === email ? { ...u, password: tempPassword } : u
   );
   localStorage.setItem('users', JSON.stringify(updatedUsers));

   setSubmitted(true);
   toast({
    title: "تم إرسال كلمة المرور المؤقتة",
    description: `كلمة المرور الجديدة: ${tempPassword}`,
   });
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في إعادة تعيين كلمة المرور",
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
       <Mail className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl font-bold">استعادة كلمة المرور</CardTitle>
      <Logo size="xl" className="m-auto" />
      <CardDescription>
       أدخل بريدك الإلكتروني لاستعادة كلمة المرور
      </CardDescription>
     </CardHeader>
     <CardContent>
      {!submitted ? (
       <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
         <Label htmlFor="email">البريد الإلكتروني</Label>
         <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=""
          required
          dir="ltr"
         />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
         {loading ? "جاري الإرسال..." : "إرسال كلمة المرور"}
        </Button>
       </form>
      ) : (
       <div className="text-center space-y-4 py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
         <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-600">تم الإرسال بنجاح!</h3>
        <p className="text-muted-foreground">
         تم إرسال كلمة المرور المؤقتة إلى بريدك الإلكتروني
        </p>
        <Button
         onClick={() => navigate("/auth")}
         className="w-full"
        >
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