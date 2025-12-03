import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, QrCode, Shield, Zap, Star, ArrowRight, Menu, X, TrendingUp, Users, Award, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { Logo } from "@/components/ui/avatar";
import FeatureShowcase from "@/components/FeatureShowcase";
import TrustBadges from "@/components/TrustBadges";
import ImageTestimonial from "@/components/ImageTestimonial";
import LiveCounter from "@/components/LiveCounter";
import InteractiveDemo from "@/components/InteractiveDemo";
import ParticleBackground from "@/components/ParticleBackground";
import FloatingElements from "@/components/FloatingElements";
import MagneticButton from "@/components/MagneticButton";
import ParallaxSection from "@/components/ParallaxSection";

const Index = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <FloatingElements />
      <Header showAuthButtons={true} />
      {/* Hero Section with layered brand background */}
      <ParallaxSection className="relative overflow-hidden">
        {/* Main gradient backdrop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/15 via-secondary/10 to-background" />

        {/* Bottom color waves for depth (inside Hero only) */}
        <div className="pointer-events-none absolute -bottom-10 -start-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl -z-10 floaty" />
        <div className="pointer-events-none absolute -bottom-16 start-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl -z-10 floaty floaty-slow" />
        <div className="pointer-events-none absolute -bottom-20 end-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10 floaty floaty-slower" />

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8 anim-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-primary font-semibold">نظام الحضور الذكي</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent anim-in">
              نظام HDOOR
              <br />
              <span className="text-4xl md:text-6xl">للحضور الذكي</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed anim-in anim-delay-1">
              نظام متطور لإدارة الحضور باستخدام الباركود الديناميكي، مصمم خصيصاً للمؤسسات التعليمية في العالم العربي
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center anim-in anim-delay-2">
              <MagneticButton
                onClick={() => navigate("/auth")}
                className="Arabic text-lg px-8 py-6"
                size="lg"
              >
                ابدأ مجاناً
              </MagneticButton>
              <MagneticButton
                onClick={() => navigate("/university-register")}
                variant="outline"
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Product showcase */}
      < section id="product" className="container mx-auto px-4 py-12 scroll-mt-24 md:scroll-mt-28" >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl border bg-card p-0 overflow-hidden aspect-video anim-in hover-lift">
            <img
              src="https://media.gettyimages.com/id/1779070756/photo/two-university-students-walk-down-campus-stairs.jpg?s=612x612&w=0&k=20&c=N7d2_6_aoPReJd9b6fUMG9xWwEj-yX9UG-qjdcIxws0=" alt="طلاب جامعيون يتجهون في الحرم الجامعي"
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
      </section >

      {/* Why us */}
      < section id="why" className="container mx-auto px-4 py-12 scroll-mt-24 md:scroll-mt-28" >
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
      </section >



      {/* Integrations / Roadmap */}
      < section className="container mx-auto px-4 py-12" >
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
      </section >



      {/* How it works */}
      < section id="how" className="container mx-auto px-4 py-12 scroll-mt-24 md:scroll-mt-28" >
        <div className="text-right mb-8 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">كيف يعمل؟</h2>
          <p className="text-muted-foreground mt-2">ثلاث خطوات بسيطة تنظّم حضور محاضراتك</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-elegant transition-all text-right">
            <div className="text-sm text-muted-foreground mb-2">الخطوة 1</div>
            <h4 className="font-bold mb-2 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> أنشئ محاضرتك</h4>
            <p className="text-muted-foreground">يقوم الأستاذ بإنشاء محاضرة وتوليد باركود خاص به في ثوانٍ.</p>
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
      </section >

      {/* Testimonials / Trust */}
      < section className="container mx-auto px-4 py-12" >
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
      </section >

      {/* CTA band */}
      < section className="relative my-8" >
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
      </section >

      {/* FAQ */}
      < section id="faq" className="container mx-auto px-4 py-12 scroll-mt-24 md:scroll-mt-28" >
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
      </section >

      {/* Contact */}
      < section className="container mx-auto px-4 py-12" >
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
      </section >

      <LiveCounter />
      <InteractiveDemo />
      <FeatureShowcase />
      <TrustBadges />

      {/* Video Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 gradient-text">
              قصص نجاح من جامعاتكم
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              استمع إلى تجارب مؤسسات تعليمية استخدمت منصتنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <ImageTestimonial
              imageUrl="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              videoUrl="https://www.youtube.com/watch?v=KFUwrzMzJc0"
              title="جامعة الملك فهد للبترول والمعادن"
              subtitle="جامعة حكومية رائدة في المملكة العربية السعودية"
              quote="نظام HDOOR ساعدنا على تحسين إدارة الحضور بنسبة 85% وتوفير الوقت للمدرسين والطلاب"
              author="د. أحمد محمد"
              role="مدير تقنية المعلومات"
            />
            <ImageTestimonial
              imageUrl="data:image/jpeg;base64,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"
              videoUrl="https://www.youtube.com/watch?v=9bZkp7q19f0"
              title="الجامعة العربية الأمريكية"
              subtitle="جامعة خاصة مرموقة في الشرق الأوسط"
              quote="وفرنا 70% من الوقت المستخدم في تسجيل الحضور التقليدي بفضل نظام الباركود الذكي"
              author="سارة أحمد"
              role="مسجل شؤون طلاب"
            />
            <ImageTestimonial
              imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              videoUrl="https://www.youtube.com/watch?v=JGwWNGJdvx8"
              title="معهد التقنية المتقدم"
              subtitle="معهد تعليمي متخصص في التكنولوجيا"
              quote="نظام موثوق وآمن يحمي خصوصية الطلاب ويضمن دقة 99.9% في تسجيل الحضور"
              author="مهند خالد"
              role="مدير المعهد"
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <ParallaxSection className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8 anim-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary font-semibold">نظام الحضور الذكي</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            دعم فني 24/7
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            إلغاء في أي وقت
          </div>
        </div>
    </div>
        </div >
      </section >

  {/* Footer */ }
  < footer className = "border-t bg-card/50 mt-8" >
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
      </footer >
    </div >
  );
};

export default Index;
