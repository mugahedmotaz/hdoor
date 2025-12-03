import React, { useState, useEffect } from 'react';
import { Users, QrCode, Shield, TrendingUp } from 'lucide-react';

interface CounterProps {
 end: number;
 duration: number;
 suffix?: string;
}

const Counter = ({ end, duration, suffix = '' }: CounterProps) => {
 const [count, setCount] = useState(0);

 useEffect(() => {
  let startTime: number;
  let animationFrame: number;

  const animate = (currentTime: number) => {
   if (!startTime) startTime = currentTime;
   const progress = Math.min((currentTime - startTime) / duration, 1);

   setCount(Math.floor(progress * end));

   if (progress < 1) {
    animationFrame = requestAnimationFrame(animate);
   }
  };

  animationFrame = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrame);
 }, [end, duration]);

 return <span>{count.toLocaleString()}{suffix}</span>;
};

const LiveCounter = () => {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
  const timer = setTimeout(() => setIsVisible(true), 500);
  return () => clearTimeout(timer);
 }, []);

 return (
  <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
   <div className="container mx-auto px-4">
    <div className="text-center mb-12">
     <h2 className="text-3xl md:text-4xl font-bold mb-4">أرقام تثق بنا</h2>
     <p className="text-muted-foreground text-lg">
      نتائج حقيقية من مؤسسات تعليمية حول العالم
     </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
     <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
       <Users className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl font-bold mb-2 text-primary">
       <Counter end={15000} duration={2000} suffix="+" />
      </div>
      <div className="text-sm text-muted-foreground">طالب نشط</div>
     </div>

     <div className={`text-center transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
       <QrCode className="w-8 h-8 text-secondary" />
      </div>
      <div className="text-4xl font-bold mb-2 text-secondary">
       <Counter end={500000} duration={2500} suffix="+" />
      </div>
      <div className="text-sm text-muted-foreground">مسح باركود</div>
     </div>

     <div className={`text-center transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
       <Shield className="w-8 h-8 text-accent" />
      </div>
      <div className="text-4xl font-bold mb-2 text-accent">
       <Counter end={99.9} duration={3000} suffix="%" />
      </div>
      <div className="text-sm text-muted-foreground">دقة الحضور</div>
     </div>

     <div className={`text-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
       <TrendingUp className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl font-bold mb-2 text-primary">
       <Counter end={70} duration={2000} suffix="%" />
      </div>
      <div className="text-sm text-muted-foreground">توفير الوقت</div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default LiveCounter;
