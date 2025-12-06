import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/Notifications";
import { Suspense, lazy } from "react";
import { PageSkeleton } from "@/components/SkeletonLoader";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPasswordComplete = lazy(() => import("./pages/ResetPasswordComplete"));
const AccountConfirmed = lazy(() => import("./pages/AccountConfirmed"));
const UniversityLogin = lazy(() => import("./pages/UniversityLogin"));
const UniversityRegister = lazy(() => import("./pages/UniversityRegister"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Index /></Suspense></ErrorBoundary>} />
              <Route path="/auth" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Auth /></Suspense></ErrorBoundary>} />
              <Route path="/forgot-password" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><ForgotPassword /></Suspense></ErrorBoundary>} />
              <Route path="/reset-password-complete" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><ResetPasswordComplete /></Suspense></ErrorBoundary>} />
              <Route path="/account-confirmed" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><AccountConfirmed /></Suspense></ErrorBoundary>} />
              <Route path="/university-login" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><UniversityLogin /></Suspense></ErrorBoundary>} />
              <Route path="/university-register" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><UniversityRegister /></Suspense></ErrorBoundary>} />
              <Route path="/dashboard" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense></ErrorBoundary>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><NotFound /></Suspense></ErrorBoundary>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </NotificationProvider>
  </QueryClientProvider>
);

export default App;
