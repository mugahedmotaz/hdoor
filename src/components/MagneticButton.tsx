import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface MagneticButtonProps {
 children: React.ReactNode;
 onClick?: () => void;
 className?: string;
 variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
 size?: 'default' | 'sm' | 'lg' | 'icon';
}

const MagneticButton = ({
 children,
 onClick,
 className = '',
 variant = 'default',
 size = 'default'
}: MagneticButtonProps) => {
 const [position, setPosition] = useState({ x: 0, y: 0 });
 const [isHovered, setIsHovered] = useState(false);
 const buttonRef = useRef<HTMLButtonElement>(null);

 const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (!buttonRef.current) return;

  const rect = buttonRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  const distance = Math.sqrt(x * x + y * y);
  const maxDistance = 100;

  if (distance < maxDistance) {
   const strength = 1 - distance / maxDistance;
   setPosition({
    x: x * strength * 0.3,
    y: y * strength * 0.3,
   });
  }
 };

 const handleMouseLeave = () => {
  setPosition({ x: 0, y: 0 });
  setIsHovered(false);
 };

 const handleMouseEnter = () => {
  setIsHovered(true);
 };

 return (
  <div className="relative inline-block">
   <Button
    ref={buttonRef}
    onClick={onClick}
    variant={variant}
    size={size}
    className={`
          relative overflow-hidden transition-all duration-300 ease-out
          ${isHovered ? 'shadow-lg scale-105' : 'shadow-md'}
          ${className}
        `}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onMouseEnter={handleMouseEnter}
    style={{
     transform: `translate(${position.x}px, ${position.y}px)`,
    }}
   >
    <span className="relative z-10 flex items-center gap-2">
     {children}
     <ArrowRight
      className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : 'translate-x-0'
       }`}
     />
    </span>

    {/* Animated background gradient */}
    <div
     className={`
            absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
    />

    {/* Ripple effect on hover */}
    {isHovered && (
     <div className="absolute inset-0">
      <div className="absolute inset-0 bg-white/20 animate-ping" />
     </div>
    )}
   </Button>
  </div>
 );
};

export default MagneticButton;
