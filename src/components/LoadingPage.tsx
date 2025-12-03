import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingPage = ({ text = 'جاري التحميل...' }: { text?: string }) => {
 return (
  <div className="min-h-screen flex items-center justify-center bg-background">
   <div className="text-center space-y-4">
    <LoadingSpinner size="lg" text={text} />
   </div>
  </div>
 );
};

export default LoadingPage;
