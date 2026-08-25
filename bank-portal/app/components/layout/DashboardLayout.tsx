"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showRightPanel?: boolean;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  showRightPanel = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative h-screen w-full max-w-[100vw] overflow-hidden bg-slate-50 font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative flex h-full w-full max-w-[100vw] overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="relative z-10 min-w-0 flex-1 w-full max-w-[100vw] overflow-y-auto overflow-x-hidden p-6 lg:p-8 no-scrollbar">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            title={title}
            subtitle={subtitle}
          />
          {children}
        </main>

        {showRightPanel && <RightPanel />}
      </div>
    </div>
  );
}
