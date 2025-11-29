import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, QrCode, Shield, Zap, Star, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/avatar";

const Index = () => {
  const navigate = useNavigate();
  // Professional campus/lecture hall hero image hosted on Unsplash CDN
  const HERO_IMAGE_URL =
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=80";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header with Logo */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="lg" showText />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>تسجيل الدخول</Button>
            <Button className="gap-2" onClick={() => navigate("/auth")}>ابدأ مجاناً</Button>
          </div>
        </div>
      </header>
      {/* Hero Section (Enhanced with professional image) */}
      <section className="relative overflow-hidden">
        {/* Background image with gradient overlays for readability */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${HERO_IMAGE_URL})`,
          }}
        />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto text-center space-y-8 text-white">
            <div className="flex items-center justify-center">
              {/* Logo without text as requested */}
              <Logo size="xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              بوابة حضور موثوقة للجامعات والمؤسسات التعليمية
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto">
              إدارة احترافية للحضور عبر الباركود وربط كل طالب بجهازه الخاص لمنع التزوير. سريعة، دقيقة، وجاهزة للعمل فوراً.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="px-8 h-12 text-base gap-2" onClick={() => navigate("/auth")}>
                <QrCode className="w-5 h-5" /> ابدأ الآن
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-12 text-base border-white/60 text-white hover:bg-white/10"
                onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
              >
                استعرض الميزات
              </Button>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-3xl font-extrabold">70%</div>
                <div className="text-xs">توفير في وقت التسجيل</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-3xl font-extrabold">+10k</div>
                <div className="text-xs">عملية حضور ناجحة</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-3xl font-extrabold">99.9%</div>
                <div className="text-xs">دقة موثوقة</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-3xl font-extrabold">24/7</div>
                <div className="text-xs">جاهزية وخدمة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border shadow-md hover:shadow-elegant transition-all space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">سريع وفعال</h3>
            <p className="text-muted-foreground">
              توفير 70% من وقت التسجيل بمسح سريع للباركود
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border shadow-md hover:shadow-elegant transition-all space-y-4 animate-in fade-in slide-in-from-bottom-9 duration-700">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">آمن ومحمي</h3>
            <p className="text-muted-foreground">
              ربط كل طالب بجهازه الشخصي لمنع الغش والتزوير
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border shadow-md hover:shadow-elegant transition-all space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold">سهل الاستخدام</h3>
            <p className="text-muted-foreground">
              واجهة بسيطة ومباشرة للطلاب والأساتذة
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold">كيف يعمل  ؟</h2>
          <p className="text-muted-foreground mt-2">ثلاث خطوات بسيطة تنظّم حضور محاضراتك</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-elegant transition-all">
            <div className="text-sm text-muted-foreground mb-2">الخطوة 1</div>
            <h4 className="font-bold mb-2 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> أنشئ محاضرتك</h4>
            <p className="text-muted-foreground">يقوم الأستاذ بإنشاء محاضرة وتوليد باركود خاص بها في ثوانٍ.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:shadow-elegant transition-all">
            <div className="text-sm text-muted-foreground mb-2">الخطوة 2</div>
            <h4 className="font-bold mb-2 flex items-center gap-2"><QrCode className="w-5 h-5 text-secondary" /> امسح الباركود</h4>
            <p className="text-muted-foreground">يقوم الطالب بمسح الباركود من جهازه المسجّل فقط لضمان الموثوقية.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:shadow-elegant transition-all">
            <div className="text-sm text-muted-foreground mb-2">الخطوة 3</div>
            <h4 className="font-bold mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> تسجيل تلقائي</h4>
            <p className="text-muted-foreground">تسجيل الحضور فورياً مع سجل تفصيلي يمكن مراجعته لاحقاً.</p>
          </div>
        </div>
      </section>

      {/* Testimonials / Trust */}
      <section className="container mx-auto px-4 py-12">
        <div className="rounded-3xl border bg-card p-8 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">+10,000</div>
              <div className="text-sm text-muted-foreground">عمليات حضور ناجحة عبر النظام</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">99.9%</div>
              <div className="text-sm text-muted-foreground">دقة مع ربط الجهاز لمنع الانتحال</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold">70%</div>
              <div className="text-sm text-muted-foreground">توفير بالوقت مقارنة بالتسجيل التقليدي</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative my-8">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold">ابدأ رحلتك مع HDOOR الآن</h3>
                <p className="text-muted-foreground">تجربة مريحة وآمنة لإدارة حضور المحاضرات</p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" className="gap-2" onClick={() => navigate("/auth")}>
                  <QrCode className="w-5 h-5" /> جرّبه مجاناً
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>تعرف أكثر</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-8">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" showText />
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} HDOOR. جميع الحقوق محفوظة.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
