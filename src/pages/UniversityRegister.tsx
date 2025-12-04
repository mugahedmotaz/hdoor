import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UniversityRegistration from "@/components/UniversityRegistration";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/avatar";

export default function UniversityRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [universityCreated, setUniversityCreated] = useState(false);

  const handleUniversityCreated = (userId: string) => {
    setUniversityCreated(true);

    toast({
      title: "تم إنشاء الجامعة بنجاح",
      description: "سيتم توجيهك إلى صفحة تسجيل الدخول...",
    });

    setTimeout(() => {
      navigate("/university-login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <Building2 className="w-8 h-8 text-primary" />
          </div>

          <Logo size="xl" className="m-auto" />
          <CardDescription>
            أنشئ حساب جامعة وابدأ في إدارة نظام الحضور
          </CardDescription>
        </CardHeader>

        <CardContent>
          {universityCreated ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-600">
                تم إنشاء الجامعة بنجاح!
              </h3>
              <p className="text-muted-foreground">
                سيتم توجيهك إلى صفحة تسجيل الدخول...
              </p>
              <Button onClick={() => navigate("/university-login")} className="w-full">
                الذهاب لتسجيل الدخول
              </Button>
            </div>
          ) : (
            <div>
              <UniversityRegistration onUniversityCreated={handleUniversityCreated} />

              <div className="text-center space-y-2">
                <Button variant="link" onClick={() => navigate("/university-login")}>
                  لديك جامعة بالفعل؟ تسجيل الدخول
                </Button>
              </div>

              <div className="text-center">
                <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  العودة للصفحة الرئيسية
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}