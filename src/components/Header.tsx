import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
 showAuthButtons?: boolean;
}

const Header = ({ showAuthButtons = true }: HeaderProps) => {
 const navigate = useNavigate();
 const user = null; // Temporary - will implement auth later
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 return (
  <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
   <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-row-reverse">
    {/* Logo */}
    <div className="flex items-center gap-4">
     <Button
      variant="ghost"
      onClick={() => navigate("/")}
      className="gap-2"
     >
      <Logo size="lg" />
     </Button>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex items-center gap-3">
     <ThemeToggle />

     {showAuthButtons && !user && (
      <>
       <Button variant="outline" onClick={() => navigate("/university-register")}>
        تسجيل جامعة
       </Button>
       <Button className="Arabic" onClick={() => navigate("/auth")}>
        ابدأ مجاناً
       </Button>
       <Button variant="ghost" onClick={() => navigate("/auth")}>
        تسجيل الدخول
       </Button>
      </>
     )}

     {user && (
      <Button variant="outline" onClick={() => navigate("/dashboard")}>
       لوحة التحكم
      </Button>
     )}
    </div>

    {/* Mobile Menu Button */}
    <div className="md:hidden flex items-center gap-2">
     <ThemeToggle />
     <Button
      variant="ghost"
      size="sm"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="p-2"
     >
      {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
     </Button>
    </div>
   </div>

   {/* Mobile Menu */}
   {mobileMenuOpen && (
    <div className="md:hidden border-t bg-background/95 backdrop-blur">
     <div className="container mx-auto px-4 py-4 space-y-3">
      {showAuthButtons && !user && (
       <>
        <Button variant="outline" onClick={() => navigate("/university-register")} className="w-full">
         تسجيل جامعة
        </Button>
        <Button onClick={() => navigate("/auth")} className="w-full">
         ابدأ مجاناً
        </Button>
        <Button variant="ghost" onClick={() => navigate("/auth")} className="w-full">
         تسجيل الدخول
        </Button>
       </>
      )}

      {user && (
       <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full">
        لوحة التحكم
       </Button>
      )}
     </div>
    </div>
   )}
  </header>
 );
};

export default Header;
