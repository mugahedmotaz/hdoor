import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, QrCode, Shield, Zap, Star, ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/avatar";

const Index = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-row-reverse">
          <Logo size="lg" />
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button className="gap-2" onClick={() => navigate("/auth")}>ابدأ مجاناً</Button>
            <Button variant="ghost" onClick={() => navigate("/auth")}>تسجيل الدخول</Button>
          </div>
          {/* Mobile menu toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="فتح القائمة"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
              <Button className="w-full" onClick={() => { setMobileOpen(false); navigate("/auth"); }}>ابدأ مجاناً</Button>
              <Button variant="ghost" className="w-full" onClick={() => { setMobileOpen(false); navigate("/auth"); }}>تسجيل الدخول</Button>
            </div>
          </div>
        )}
      </header>
      {/* Hero Section with layered brand background */}
      <section className="relative overflow-hidden">
        {/* Main gradient backdrop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/15 via-secondary/10 to-background" />

        {/* Bottom color waves for depth (inside Hero only) */}
        <div className="pointer-events-none absolute -bottom-10 -start-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl -z-10 floaty" />
        <div className="pointer-events-none absolute -bottom-16 start-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl -z-10 floaty floaty-slow" />
        <div className="pointer-events-none absolute -bottom-20 end-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10 floaty floaty-slower" />

        {/* Bottom fade to background to anchor the section visually */}
        <div className="absolute bottom-0 start-0 end-0 h-40 bg-gradient-to-t from-background/80 via-background/40 to-transparent -z-10" />

        <div className="container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-6xl mx-auto text-right space-y-6 md:space-y-8 flex flex-col ">

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight anim-in">
              بوابة حضور موثوقة للجامعات والمؤسسات التعليمية
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground anim-in anim-delay-1">
              إدارة احترافية للحضور عبر الباركود وربط كل طالب بجهازه الخاص لمنع التزوير. سريعة، دقيقة، وجاهزة للعمل فوراً.
            </p>
            <div className="w-full md:w-auto flex flex-wrap items-center  gap-3 md:gap-4 anim-in anim-delay-2">
              <Button size="lg" className="w-full md:w-auto px-8 h-12 text-base gap-2 md:text-lg" onClick={() => navigate("/auth")}>
                <QrCode className="w-5 h-5" /> ابدأ الآن
              </Button>
              <Button size="lg" variant="outline" className="w-full md:w-auto px-8 h-12 text-base md:text-lg" onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}>
                استعرض الميزات
              </Button>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-right  w-full md:w-auto anim-in anim-delay-3">
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

      {/* Product showcase */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl border bg-card p-0 overflow-hidden aspect-video anim-in hover-lift">
            <img
              src="https://media.gettyimages.com/id/1779070756/photo/two-university-students-walk-down-campus-stairs.jpg?s=612x612&w=0&k=20&c=N7d2_6_aoPReJd9b6fUMG9xWwEj-yX9UG-qjdcIxws0="
              alt="طلاب جامعيون يتجهون في الحرم الجامعي"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-3 text-right anim-in anim-delay-1">
            <h2 className="text-3xl md:text-4xl font-extrabold">لمحة سريعة عن النظام</h2>
            <p className="text-muted-foreground font-bold pb-4">إنشاء المحاضرات، توليد باركود متجدد، مسح سريع من جهاز الطالب المسجّل، وتسجيل فوري للحضور.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center  gap-2"><Zap className="w-4 h-4 text-primary" /><span>سرعة في الإعداد والعمل</span></li>
              <li className="flex items-center  gap-2"><Shield className="w-4 h-4 text-secondary" /><span>أمان وربط جهاز واحد لكل مستخدم</span></li>
              <li className="flex items-center  gap-2"><QrCode className="w-4 h-4 text-accent" /><span>باركود ديناميكي متجدد كل 5 ثوانٍ</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-right">
          <div className="p-6 rounded-2xl border bg-card space-y-2 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="font-bold">سرعة ومرونة</h3>
            <p className="text-sm text-muted-foreground">انطلق خلال دقائق بواجهة عربية RTL محسّنة.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-2 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <Shield className="w-6 h-6 text-secondary" />
            <h3 className="font-bold">أمان موثوق</h3>
            <p className="text-sm text-muted-foreground">منع الانتحال بربط جهاز واحد ديناميكيًا.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-2 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <QrCode className="w-6 h-6 text-accent" />
            <h3 className="font-bold">باركود متجدد</h3>
            <p className="text-sm text-muted-foreground">تحديث كل 5 ثوانٍ لزيادة الموثوقية.</p>
          </div>
        </div>
      </section>



      {/* Integrations / Roadmap */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-right">
          <div className="p-6 rounded-2xl border bg-card space-y-2">
            <h3 className="font-bold">تكاملات</h3>
            <p className="text-sm text-muted-foreground">CSV/Excel، تصدير تقارير، وربط لاحقًا مع Google Sheets.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-2">
            <h3 className="font-bold">الأمان</h3>
            <p className="text-sm text-muted-foreground">ربط جهاز واحد فعّال، وضبط صلاحيات، وتدقيق سجلات.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-2">
            <h3 className="font-bold">خارطة الطريق</h3>
            <p className="text-sm text-muted-foreground">تقارير متقدمة، تطبيق جوّال، ولوحة تحكم للإداريين.</p>
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
              <div className="text-right space-y-2 ">
                <h3 className="text-2xl md:text-2xl font-extrabold">ابدأ رحلتك مع  hdoor الآن</h3>
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
        <div className=" text-right mb-6 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold">الأسئلة الشائعة</h2>
        </div>
        <div className="max-w-3xl m-auto  space-y-3 text-right">
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">هل يعمل النظام بدون إنترنت؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">المسح والتسجيل يتطلبان اتصالاً، لكن عرض الباركود يمكن أن يعمل في اتصال ضعيف.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">كيف يتم منع الانتحال؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">نربط كل حساب بجهاز واحد فعّال فقط، ونحدّث الباركود دوريًا لمنع النسخ.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">هل يمكن استخراج تقارير؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">نعم، تتوفر سجلات حضور قابلة للمراجعة والتصدير لاحقًا كـ CSV/Excel.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">هل يدعم RTL واللغة العربية؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">نعم، الواجهة بالكامل RTL مع خط عربي احترافي.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">هل هناك قيود على الأجهزة؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">يُسمح بجهاز فعّال واحد لكل حساب لمنع الدخول المتعدد.</p>
          </details>
          <details className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">ما هي خطة التسعير المناسبة؟</summary>
            <p className="mt-2 text-sm text-muted-foreground">ابدأ بالتجريبي، ثم الأساسي للأقسام، والمؤسسي للجامعات الكبيرة.</p>
          </details>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl m-auto  rounded-2xl border bg-card p-6 text-right">
          <h2 className="text-2xl font-extrabold mb-4">تواصل معنا</h2>
          <form className="grid gap-4 text-right">
            <input className="rounded-md border bg-background p-3" placeholder="الاسم" />
            <input className="rounded-md border bg-background p-3" placeholder="البريد الإلكتروني" />
            <textarea className="rounded-md border bg-background p-3" rows={4} placeholder="رسالتك" />
            <div className="flex justify-start">
              <Button className="gap-2">إرسال</Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-8">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-4 text-right">
            <div className="space-y-3">
              <Logo size="md" />
              <p className="text-sm text-muted-foreground">
                نظام عربي موثوق لإدارة حضور المحاضرات عبر باركود متجدد وربط جهاز واحد لكل مستخدم.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-3">المنتج</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">الميزات</a></li>
                <li><a href="#" className="hover:text-foreground">كيف يعمل</a></li>
                <li><a href="#" className="hover:text-foreground">التسعير</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3">الموارد</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-foreground">التكاملات</a></li>
                <li><a href="#" className="hover:text-foreground">خارطة الطريق</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-3">الدعم والقانوني</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">تواصل معنا</a></li>
                <li><a href="#" className="hover:text-foreground">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-foreground">الشروط والأحكام</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-xs text-muted-foreground flex items-center justify-between flex-row-reverse">
            <div>  2025 HDOOR. جميع الحقوق محفوظة.  تم تطويره بواسطة <a className="font-bold" href="#">Mugahed motaz</a></div>
            <div className="hidden md:block">مبني بخبرة وتجربة لتقديم أفضل أداء وتجربة عربية.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
