import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
 hasError: boolean;
 error?: Error;
}

interface ErrorBoundaryProps {
 children: React.ReactNode;
 fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
  super(props);
  this.state = { hasError: false };
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
  return { hasError: true, error };
 }

 componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Error caught by boundary:', error, errorInfo);
 }

 reset = () => {
  this.setState({ hasError: false, error: undefined });
 };

 render() {
  if (this.state.hasError) {
   const FallbackComponent = this.props.fallback || DefaultErrorFallback;
   return <FallbackComponent error={this.state.error} reset={this.reset} />;
  }

  return this.props.children;
 }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
 return (
  <div className="min-h-screen flex items-center justify-center p-4">
   <Card className="w-full max-w-md">
    <CardHeader className="text-center">
     <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
      <AlertTriangle className="w-6 h-6 text-destructive" />
     </div>
     <CardTitle className="text-xl">حدث خطأ غير متوقع</CardTitle>
     <CardDescription>
      نأسف للإزعاج، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.
     </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
     {error && (
      <div className="p-3 bg-muted rounded-lg">
       <p className="text-sm text-muted-foreground font-mono">
        {error.message}
       </p>
      </div>
     )}
     <Button onClick={reset} className="w-full">
      <RefreshCw className="w-4 h-4 ml-2" />
      إعادة المحاولة
     </Button>
    </CardContent>
   </Card>
  </div>
 );
}

export default ErrorBoundary;
