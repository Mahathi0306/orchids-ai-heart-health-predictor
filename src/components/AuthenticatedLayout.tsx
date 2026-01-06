"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppShell from "@/components/AppShell";
import { HealthCoachChat } from "@/components/HealthCoachChat";
import { Loader2, Heart } from "lucide-react";

// Routes that don't need the AppShell wrapper
const publicRoutes = ["/login", "/signup", "/forgot-password"];

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useAuth();

  const isPublicRoute = publicRoutes.includes(pathname);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          <p className="text-slate-500 text-sm">Loading CardioAI...</p>
        </div>
      </div>
    );
  }

  // Public routes (login, signup) - render without AppShell
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Protected routes - render with AppShell if authenticated
  if (isAuthenticated) {
    return (
      <>
        <AppShell>{children}</AppShell>
        <HealthCoachChat />
      </>
    );
  }

  // Not authenticated and not on public route - will be redirected by AuthContext
  // Show loading state while redirect happens
  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        <p className="text-slate-500 text-sm">Redirecting to login...</p>
      </div>
    </div>
  );
}
