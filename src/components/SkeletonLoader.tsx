import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
 className?: string;
 children?: React.ReactNode;
}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
 return (
  <div
   className={cn('animate-pulse rounded-md bg-muted', className)}
   {...props}
  />
 );
};

export function PageSkeleton() {
 return (
  <div className="min-h-screen p-4 space-y-6">
   <div className="flex items-center justify-between">
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-10 w-20" />
   </div>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
     <div key={i} className="p-4 border rounded-lg space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-16" />
     </div>
    ))}
   </div>
   <div className="space-y-4">
    <Skeleton className="h-6 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-24 w-full" />
     ))}
    </div>
   </div>
  </div>
 );
}

export default Skeleton;
