import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { Logo } from "@/components/ui/avatar";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [role, setRole] = useState<"student" | "professor">("student");

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

      if (error) throw error;

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
        description: error.message,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-2">
          {/* <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-2">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div> */}
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {/* نظام الحضور الذكي */}
          </CardTitle>
          <Logo size="xl" className="m-auto" />
          <CardDescription>إدارة الحضور بالباركود</CardDescription>
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
                    placeholder="student@university.edu"
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
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="float-right pb-4">الاسم الكامل</Label>
                  <Input
                    className="text-right"
                    id="fullname"
                    type="text"
                    placeholder="أحمد محمد"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university-id" className="float-right pb-4">الرقم الجامعي</Label>
                  <Input
                    id="university-id"
                    className="text-right"
                    type="text"
                    placeholder="202301234"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="float-right pb-4">البريد الإلكتروني</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    className="text-right"
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
                <div className="space-y-2 float-right">
                  <Label >نوع الحساب</Label>
                  <RadioGroup value={role} onValueChange={(v) => setRole(v as "student" | "professor")}>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="student" className=" m-1 cursor-pointer"> طالب</Label>
                      <RadioGroupItem value="student" id="student" />
                    </div>
                    <div className="flex items-center space-x-2 ">
                      <Label htmlFor="professor" className=" m-1 cursor-pointer">أستاذ</Label>
                      <RadioGroupItem value="professor" id="professor" />
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري التسجيل..." : "إنشاء حساب"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
