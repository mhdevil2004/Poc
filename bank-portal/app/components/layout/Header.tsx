"use client";

import { Bell, Calendar, ChevronDown, Menu, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ onMenuClick, title = "Dashboard", subtitle }: HeaderProps) {
  const { user } = useAuth();
  const initials = (user?.name || "JD")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 bg-white/70 backdrop-blur-xl border border-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4 text-[#6B7280]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 font-medium">
            {subtitle || `Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search"
            className="pl-11 pr-4 py-2.5 bg-white/70 backdrop-blur-xl border border-white rounded-full text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-56 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/70 backdrop-blur-xl border border-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Calendar className="w-4 h-4 text-[#6B7280]" strokeWidth={1.5} />
          </div>
          <div className="relative w-9 h-9 bg-white/70 backdrop-blur-xl border border-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Bell className="w-4 h-4 text-[#6B7280]" strokeWidth={1.5} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-blue-500/30">
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
