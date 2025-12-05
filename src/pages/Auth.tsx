import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { Logo } from "@/components/ui/avatar";
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [role, setRole] = useState<"student">("student");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await dataClient.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await dataClient.signUp(
        email,
        password,
        fullName,
        universityId,
        role
      );

      if (error) {
        // معالجة خاصة لحالة البريد المسجّل مسبقاً
        const msg = (error as any).message?.toString().toLowerCase() ?? "";
        if (msg.includes("user already registered") || msg.includes("already registered")) {
          throw new Error("هذا البريد الإلكتروني مسجّل بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول بهذا البريد.");
        }
        throw error;
      }

      if (data?.user) {
        toast({
          title: "تم التسجيل بنجاح!",
          description: "يمكنك تسجيل الدخول الآن",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: error.message || "تعذر إكمال عملية التسجيل. حاول ببريد مختلف أو قم بتسجيل الدخول.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // تلميح بأن تسجيل الدخول بجوجل من سياق الطلاب
      window.localStorage.setItem("hdoor_google_role_hint", "student");
      const { error } = await dataClient.signInWithGoogle();
      if (error) throw error;
      // Supabase سيعيد التوجيه بعد نجاح OAuth حسب redirectTo
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول بجوجل",
        description: error.message ?? "تعذر إكمال تسجيل الدخول عبر Google",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await dataClient.signIn(email, password);
      if (error) throw error;
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error.message,
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
            {/* <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-2">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div> */}
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {/* نظام الحضور الذكي */}
            </CardTitle>
            <Logo size="xl" className="m-auto" />
            <CardDescription>تسجيل الطلاب فقط | الأساتذة يتم إضافتهم عبر إدارة الجامعة</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="float-right pb-4">البريد الإلكتروني</Label>
                    <Input
                      id="login-email"
                      type="email"
                      className="text-right"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="float-right pb-4">كلمة المرور</Label>
                    <Input
                      id="login-password"
                      type="password"
                      className="text-right"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "جاري التحميل..." : "دخول"}
                  </Button>

                  <div className="relative py-2 text-center text-xs text-muted-foreground">
                    <span className="bg-background px-2 relative z-10">أو</span>
                    <div className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden="true" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    تسجيل الدخول بواسطة Google
                  </Button>
                </form>
                <div className="text-center">
                  <Button variant="link" onClick={() => navigate("/forgot-password")}>
                    نسيت كلمة المرور؟
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="float-right pb-4">البريد الإلكتروني</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      className="text-right"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="float-right pb-4">كلمة المرور</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      className="text-right"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      dir="ltr"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "جاري التسجيل..." : "إنشاء حساب طالب"}
                  </Button>

                  <div className="relative py-2 text-center text-xs text-muted-foreground">
                    <span className="bg-background px-2 relative z-10">أو</span>
                    <div className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden="true" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    إنشاء / تسجيل حساب طالب بواسطة Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <div className="text-center">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 my-4">
              <ArrowLeft className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
