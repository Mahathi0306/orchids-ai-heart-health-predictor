"use client";

import { Sidebar } from "./Navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200">
      <Sidebar />
      <div className="pl-24">
        {children}
      </div>
    </div>
  );
}
