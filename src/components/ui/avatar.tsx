import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

// Site Logo component (uses image from /public)
type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  className?: string;
  textClassName?: string;
  size?: LogoSize; // controls image height
  showText?: boolean; // show brand text next to the logo
}

const sizeMap: Record<LogoSize, string> = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
};

export function Logo({ className, textClassName, size = "md", showText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Place the logo file at public/logo-hdoor.png */}
      <img
        src="/logo hdoor.png"
        alt="HDOOR Logo"
        className={cn("w-auto", sizeMap[size])}
        loading="eager"
        decoding="async"
      />
      {showText && (
        <span className={cn(
          "font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
          textClassName
        )}>
          HDOOR
        </span>
      )}
    </div>
  );
}
