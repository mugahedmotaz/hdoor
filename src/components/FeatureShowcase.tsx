import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Shield, QrCode, Globe, Smartphone, Award } from 'lucide-react';

interface FeatureCardProps {
 icon: React.ReactNode;
 title: string;
 description: string;
 badge?: string;
 comingSoon?: boolean;
}

const FeatureCard = ({ icon, title, description, badge, comingSoon }: FeatureCardProps) => (
 <Card className="group relative overflow-hidden border-0 shadow-elegant hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
  <CardContent className="p-8 text-right">
   <div className="flex items-start justify-between mb-4">
    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
     {icon}
    </div>
    {badge && (
     <Badge variant="secondary" className="text-xs">
      {badge}
     </Badge>
    )}
   </div>

   <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
    {title}
   </h3>

   <p className="text-muted-foreground leading-relaxed mb-4">
    {description}
   </p>

   {comingSoon && (
    <Badge variant="outline" className="text-xs">
     قريباً
    </Badge>
   )}
  </CardContent>

  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
 </Card>
);

const FeatureShowcase = () => {
 const features = [
  {
   icon: <Zap className="w-7 h-7 text-primary" />,
   title: "سرعة فائقة",
   description: "تسجيل حضور فوري خلال ثوانٍ معدودة مع معالجة ذكية للبيانات",
   badge: "مميز"
  },
  {
   icon: <Shield className="w-7 h-7 text-secondary" />,
   title: "أمان متقدم",
   description: "تشفير البيانات وحماية الخصوصية مع ربط جهاز واحد لكل مستخدم",
   badge: "آمن"
  },
  {
   icon: <QrCode className="w-7 h-7 text-accent" />,
   title: "باركود ديناميكي",
   description: " رموز مع حمايه في هاتف واحدQR متجددة كل 5 ثوانٍ لمنع التزوير والانتحال",
   badge: "فريد"
  },
  {
   icon: <Globe className="w-7 h-7 text-primary" />,
   title: "دعم متعدد اللغات",
   description: "واجهة عربية احترافية مع دعم RTL وخطوط عربية مخصصة",
   comingSoon: true
  },
  {
   icon: <Smartphone className="w-7 h-7 text-secondary" />,
   title: "تطبيق موبايل",
   description: "تطبيق مخصص للأجهزة المحمولة مع إشعارات فورية",
   comingSoon: true
  },
  {
   icon: <Award className="w-7 h-7 text-accent" />,
   title: "شهادات موثوقة",
   description: " مع تقارير رسمية وقابلة للتصدير  والتوثيق في الحضور الكامل",
   comingSoon: true
  }
 ];

 return (
  <section className="py-20 bg-gradient-to-b from-background to-muted/20">
   <div className="container mx-auto px-4">
    <div className="text-center max-w-4xl mx-auto mb-16">
     <h2 className="text-4xl md:text-5xl font-extrabold mb-6 gradient-text">
      ميزات تجعلنا مختلفين
     </h2>
     <p className="text-xl text-muted-foreground leading-relaxed">
      منصة متكاملة تجمع بين الأمان والسرعة وسهولة الاستخدام
     </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
     {features.map((feature, index) => (
      <div
       key={index}
       className="anim-in anim-delay-1"
       style={{ animationDelay: `${index * 0.1}s` }}
      >
       <FeatureCard {...feature} />
      </div>
     ))}
    </div>

    <div className="text-center mt-16">
     <Button size="lg" className="px-8 py-4 text-lg">
      اكتشف جميع الميزات
     </Button>
    </div>
   </div>
  </section>
 );
};

export default FeatureShowcase;
