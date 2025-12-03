import React, { useEffect, useState, useRef } from 'react';

interface ParallaxSectionProps {
 children: React.ReactNode;
 className?: string;
 speed?: number;
}

const ParallaxSection = ({
 children,
 className = '',
 speed = 0.5
}: ParallaxSectionProps) => {
 const [offsetY, setOffsetY] = useState(0);
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const handleScroll = () => {
   if (!ref.current) return;

   const rect = ref.current.getBoundingClientRect();
   const scrolled = window.pageYOffset;
   const rate = scrolled * -speed;

   // Only apply parallax when element is in view
   if (rect.top < window.innerHeight && rect.bottom > 0) {
    setOffsetY(rate);
   }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial calculation

  return () => window.removeEventListener('scroll', handleScroll);
 }, [speed]);

 return (
  <div
   ref={ref}
   className={`relative ${className}`}
   style={{
    transform: `translateY(${offsetY}px)`,
    willChange: 'transform',
   }}
  >
   {children}
  </div>
 );
};

export default ParallaxSection;
