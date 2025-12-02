import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, QrCode, Shield, Zap, Star, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/avatar";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-row-reverse">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            <Button className="gap-2" onClick={() => navigate("/auth")}>ابدأ مجاناً</Button>
            <Button variant="ghost" onClick={() => navigate("/auth")}>تسجيل الدخول</Button>
          </div>
        </div>
      </header>
      {/* Hero Section with layered brand background */}
      <section className="relative overflow-hidden">
        {/* Main gradient backdrop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/15 via-secondary/10 to-background" />

        {/* Bottom color waves for depth (inside Hero only) */}
        <div className="pointer-events-none absolute -bottom-10 -start-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl -z-10" />
        <div className="pointer-events-none absolute -bottom-16 start-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl -z-10" />
        <div className="pointer-events-none absolute -bottom-20 end-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10" />

        {/* Bottom fade to background to anchor the section visually */}
        <div className="absolute bottom-0 start-0 end-0 h-40 bg-gradient-to-t from-background/80 via-background/40 to-transparent -z-10" />

        <div className="container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-6xl mx-auto text-right space-y-6 md:space-y-8 flex flex-col ">
           
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              بوابة حضور موثوقة للجامعات والمؤسسات التعليمية
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
              إدارة احترافية للحضور عبر الباركود وربط كل طالب بجهازه الخاص لمنع التزوير. سريعة، دقيقة، وجاهزة للعمل فوراً.
            </p>
            <div className="w-full md:w-auto flex flex-wrap items-center  gap-3 md:gap-4">
              <Button size="lg" className="w-full md:w-auto px-8 h-12 text-base gap-2 md:text-lg" onClick={() => navigate("/auth")}>
                <QrCode className="w-5 h-5" /> ابدأ الآن
              </Button>
              <Button size="lg" variant="outline" className="w-full md:w-auto px-8 h-12 text-base md:text-lg" onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}>
                استعرض الميزات
              </Button>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-right  w-full md:w-auto">
              <div className="rounded-2xl border bg-card p-5 min-h-[96px] flex flex-col justify-center">
                <div className="text-4xl font-extrabold">70%</div>
                <div className="text-sm">توفير في وقت التسجيل</div>
              </div>
              <div className="rounded-2xl border bg-card p-5 min-h-[96px] flex flex-col justify-center">
                <div className="text-4xl font-extrabold">+10k</div>
                <div className="text-sm">عملية حضور ناجحة</div>
              </div>
              <div className="rounded-2xl border bg-card p-5 min-h-[96px] flex flex-col justify-center">
                <div className="text-4xl font-extrabold">99.9%</div>
                <div className="text-sm">دقة موثوقة</div>
              </div>
              <div className="rounded-2xl border bg-card p-5 min-h-[96px] flex flex-col justify-center">
                <div className="text-4xl font-extrabold">24/7</div>
                <div className="text-sm">جاهزية وخدمة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border shadow-md hover:shadow-elegant transition-all space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 text-right">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">سريع وفعال</h3>
            <p className="text-muted-foreground">
              توفير 70% من وقت التسجيل بمسح سريع للباركود
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border shadow-md hover:shadow-elegant transition-all space-y-4 animate-in fade-in slide-in-from-bottom-9 duration-700 text-right">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">آمن ومحمي</h3>
            <p className="text-muted-foreground">
              ربط كل طالب بجهازه الشخصي لمنع الغش والتزوير
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border shadow-md hover:shadow-elegant transition-all space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-700 text-right">
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
        <div className="text-right mb-8 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">كيف يعمل؟</h2>
          <p className="text-muted-foreground mt-2">ثلاث خطوات بسيطة تنظّم حضور محاضراتك</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-elegant transition-all text-right">
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
        <div className="rounded-3xl border bg-card p-8 md:p-10 shadow-sm max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start text-right">
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
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:flex-row-reverse">
              <div className="text-right space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold">ابدأ رحلتك مع HDOOR الآن</h3>
                <p className="text-muted-foreground">تجربة مريحة وآمنة لإدارة حضور المحاضرات</p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" className="gap-2" onClick={() => navigate("/auth")}>
                  <QrCode className="w-5 h-5" /> جرّبه مجاناً
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>تعرف أكثر</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-right mb-6 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold">الأسئلة الشائعة</h2>
        </div>
        <div className="max-w-3xl ms-auto space-y-3">
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">هل يعمل النظام بدون إنترنت؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">يحتاج لمسح الباركود وتأكيد الحضور اتصالاً. يمكن عرض الباركود للأستاذ حتى في اتصال ضعيف.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">كيف يتم منع الانتحال؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">نربط كل حساب بجهاز واحد فعّال فقط، ونحدّث الباركود كل 5 ثوانٍ.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">هل يمكن استخراج تقارير؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">نعم، تتوفر سجلات حضور قابلة للمراجعة والتصدير مستقبلاً.</p>
          </details>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t bg-card/50 mt-8">
        {/* <div className="container mx-auto px-4 py-8 flex flex_col md:flex-row items-center justify-between gap-4"> */}
        {/* <Logo size="md" showText /> */}
        {/* <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} HDOOR. جميع الحقوق محفوظة.</div> */}
        {/* </div> */}
      </footer>
    </div>
  );
};

export default Index;
