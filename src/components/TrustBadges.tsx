import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Users, Clock, CheckCircle, Globe } from 'lucide-react';

const TrustBadges = () => {
 const badges = [
  {
   icon: <Shield className="w-6 h-6" />,
   title: "موثوق عالمياً",
   description: "معايير أمان دولية"
  },
  {
   icon: <Users className="w-6 h-6" />,
   title: "10,000+ مستخدم",
   description: "جامعات ومؤسسات تعليمية"
  },
  {
   icon: <Clock className="w-6 h-6" />,
   title: "24/7 دعم فني",
   description: "مساعدة مستمرة"
  },
  {
   icon: <CheckCircle className="w-6 h-6" />,
   title: "99.9% دقة",
   description: "معدل نجاح موثوق"
  },
  {
   icon: <Award className="w-6 h-6" />,
   title: "جوائز عديدة",
   description: "تقدير عالمي"
  },
  {
   icon: <Globe className="w-6 h-6" />,
   title: "متوفر عالمياً",
   description: "خدمة عالمية"
  }
 ];

 return (
  <section className="py-16 bg-muted/30">
   <div className="container mx-auto px-4">
    <div className="text-center mb-12">
     <h2 className="text-3xl font-bold mb-4">لماذا تثق بنا؟</h2>
     <p className="text-muted-foreground text-lg">
      شركاء موثوقون في قطاع التعليم حول العالم
     </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
     {badges.map((badge, index) => (
      <Card
       key={index}
       className="text-center border-0 shadow-sm hover:shadow-md transition-shadow"
      >
       <CardContent className="p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
         {badge.icon}
        </div>
        <h3 className="font-semibold text-sm mb-2">{badge.title}</h3>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
       </CardContent>
      </Card>
     ))}
    </div>
   </div>
  </section>
 );
};

export default TrustBadges;
