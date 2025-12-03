import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import ProfessorDashboard from "@/components/dashboard/ProfessorDashboard";
import UniversityDashboard from "@/components/UniversityDashboard";
import { LogOut, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/avatar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await dataClient.getSession();

      if (!session || !session.user) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      // Get user role (supports both local and supabase)
      const role = await dataClient.getUserRoleAsync(session.user.id);
      if (!role) throw new Error("تعذر تحديد دور المستخدم");
      setUserRole(role);
    } catch (error: any) {
      console.error("Error checking user:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dataClient.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-row-reverse">
          <div className="flex items-center">
            <Logo size="lg" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {userRole === "student" && userId && <StudentDashboard userId={userId} />}
        {userRole === "professor" && userId && <ProfessorDashboard userId={userId} />}
        {userRole === "admin" && userId && <UniversityDashboard universityId={userId} adminId={userId} />}
      </main>
    </div>
  );
};

export default Dashboard;
