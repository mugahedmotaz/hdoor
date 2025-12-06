import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

export default function AccountConfirmed() {
 const navigate = useNavigate();

 return (
  <div className="min-h-screen bg-background">
   <Header showAuthButtons={false} />
   <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
    <Card className="w-full max-w-md shadow-elegant text-center">
     <CardHeader className="space-y-2">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
       <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <CardTitle className="text-2xl font-bold">تم تأكيد الحساب بنجاح</CardTitle>
      <CardDescription>
       يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور
      </CardDescription>
     </CardHeader>
     <CardContent className="space-y-4">
      <Button onClick={() => navigate("/auth")} className="w-full">
       العودة لتسجيل الدخول
      </Button>
      <Button
       variant="ghost"
       onClick={() => navigate("/")}
       className="w-full gap-2"
      >
       <ArrowLeft className="w-4 h-4" />
       العودة للصفحة الرئيسية
      </Button>
     </CardContent>
    </Card>
   </div>
  </div>
 );
}
