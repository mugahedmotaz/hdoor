import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Smartphone, CheckCircle, Clock, Users } from 'lucide-react';

const InteractiveDemo = () => {
 const [currentStep, setCurrentStep] = useState(0);
 const [isScanning, setIsScanning] = useState(false);

 const steps = [
  {
   title: 'إنشاء المحاضرة',
   description: 'يقوم الأستاذ بإنشاء محاضرة جديدة وإنشاء باركود فريد',
   icon: <Users className="w-6 h-6" />,
   color: 'bg-primary/10 text-primary'
  },
  {
   title: 'عرض الباركود',
   description: 'يظهر باركود ديناميكي يتجدد كل 5 ثوانٍ',
   icon: <QrCode className="w-6 h-6" />,
   color: 'bg-secondary/10 text-secondary'
  },
  {
   title: 'مسح الباركود',
   description: 'يستخدم الطالب هاتفه لمسح الباركود',
   icon: <Smartphone className="w-6 h-6" />,
   color: 'bg-accent/10 text-accent'
  },
  {
   title: 'تسجيل الحضور',
   description: 'يتم تسجيل الحضور فورياً مع التوقيت الدقيق',
   icon: <CheckCircle className="w-6 h-6" />,
   color: 'bg-green-100 text-green-600'
  }
 ];

 const handleNext = () => {
  if (currentStep < steps.length - 1) {
   setCurrentStep(currentStep + 1);
  }
 };

 const handlePrevious = () => {
  if (currentStep > 0) {
   setCurrentStep(currentStep - 1);
  }
 };

 const handleScan = () => {
  setIsScanning(true);
  setTimeout(() => {
   setIsScanning(false);
   handleNext();
  }, 2000);
 };

 return (
  <section className="py-20 bg-muted/30">
   <div className="container mx-auto px-4">
    <div className="text-center max-w-4xl mx-auto mb-16">
     <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
      جرب النظام بنفسك
     </h2>
     <p className="text-xl text-muted-foreground">
      تفاعل مع عرض توضيحي مباشر لكيفية عمل نظام الحضور الذكي
     </p>
    </div>

    <div className="max-w-4xl mx-auto">
     {/* Progress Bar */}
     <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
       {steps.map((_, index) => (
        <div
         key={index}
         className={`flex-1 h-2 ${index <= currentStep ? 'bg-primary' : 'bg-muted'
          } ${index < steps.length - 1 ? 'ml-2' : ''}`}
        />
       ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
       {steps.map((step, index) => (
        <span key={index} className={index <= currentStep ? 'text-primary font-semibold' : ''}>
         {index + 1}. {step.title}
        </span>
       ))}
      </div>
     </div>

     {/* Current Step */}
     <Card className="overflow-hidden">
      <CardContent className="p-8">
       <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${steps[currentStep].color}`}>
         {steps[currentStep].icon}
        </div>
        <div>
         <h3 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h3>
         <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>
       </div>

       {/* Interactive Content */}
       <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 mb-6">
        {currentStep === 0 && (
         <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
           <Users className="w-16 h-16 text-primary" />
          </div>
          <p className="text-lg">الأستاذ يجهز المحاضرة للطلاب</p>
         </div>
        )}

        {currentStep === 1 && (
         <div className="text-center space-y-4">
          <div className="relative inline-block">
           <div className="w-32 h-32 bg-white p-4 rounded-lg shadow-lg">
            <div className="w-full h-full bg-black rounded" />
           </div>
           <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-pulse" />
          </div>
          <p className="text-lg">باركود فريد يتجدد تلقائياً</p>
         </div>
        )}

        {currentStep === 2 && (
         <div className="text-center space-y-4">
          <div className="relative inline-block">
           <div className="w-32 h-32 bg-accent/10 rounded-2xl flex items-center justify-center">
            <Smartphone className="w-16 h-16 text-accent" />
           </div>
           {isScanning && (
            <div className="absolute inset-0 border-4 border-accent rounded-2xl animate-ping" />
           )}
          </div>
          <Button onClick={handleScan} disabled={isScanning} className="mt-4">
           {isScanning ? 'جاري المسح...' : 'امسح الباركود'}
          </Button>
         </div>
        )}

        {currentStep === 3 && (
         <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
           <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <div className="text-lg space-y-2">
           <p className="font-semibold text-green-600">تم تسجيل الحضور بنجاح!</p>
           <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleTimeString('ar-SA')}
           </p>
          </div>
         </div>
        )}
       </div>

       {/* Navigation */}
       <div className="flex justify-between">
        <Button
         variant="outline"
         onClick={handlePrevious}
         disabled={currentStep === 0}
        >
         السابق
        </Button>

        {currentStep < steps.length - 1 && (
         <Button onClick={handleNext}>
          التالي
         </Button>
        )}

        {currentStep === steps.length - 1 && (
         <Button onClick={() => setCurrentStep(0)}>
          إعادة العرض
         </Button>
        )}
       </div>
      </CardContent>
     </Card>
    </div>
   </div>
  </section>
 );
};

export default InteractiveDemo;
