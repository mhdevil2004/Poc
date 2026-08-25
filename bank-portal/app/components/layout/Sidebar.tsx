"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Bot,
  Briefcase,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/formatters";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/loans", icon: ArrowLeftRight, label: "Loans" },
  { href: "/ai-assistant", icon: Bot, label: "AI Assistant" },
  { href: "/investments", icon: Briefcase, label: "Investments" },
  { href: "/cards", icon: CreditCard, label: "Cards" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/balance", icon: FileText, label: "Balance" },
];


export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-50 h-full w-[72px] bg-white/70 backdrop-blur-xl border-r border-white flex flex-col items-center py-6 flex-shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-1.5 mb-10">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>

        <nav className="flex flex-col items-center gap-7 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className="relative flex items-center"
              >
                {active && (
                  <div className="absolute -left-3 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    active ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                  )}
                  strokeWidth={1.5}
                />
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          title="Logout"
          className="mb-4 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div className="w-10 h-10 relative rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <Image src="/images/fintilla.jpg" alt="Fintilla" width={40} height={40} className="object-cover" />
        </div>
      </aside>
    </>
  );
}
