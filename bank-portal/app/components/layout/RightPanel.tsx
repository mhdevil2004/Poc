"use client";

import { useMemo } from "react";
import { Bolt, Briefcase, Car, Droplets, Home, Wifi } from "lucide-react";
import { useLoans } from "@/hooks/useLoans";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils/formatters";

export function RightPanel() {
  const { user } = useAuth();
  const { loans } = useLoans({ limit: 100 });

  const recent = useMemo(() => loans.slice(0, 4), [loans]);
  const upcoming = useMemo(
    () => loans.filter((loan) => loan.status === "pending").slice(0, 2),
    [loans]
  );

  const activityIcons = [Droplets, Briefcase, Bolt, Wifi];

  return (
    <aside className="hidden xl:flex w-[320px] max-w-[320px] p-6 flex-col overflow-y-auto overflow-x-hidden flex-shrink-0 no-scrollbar">
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 shadow-[0_8px_40px_rgb(0,0,0,0.18)] ring-1 ring-inset ring-white/20">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-6 bg-gradient-to-b from-[#D4AF37] to-[#B8960F] rounded-md shadow-[0_2px_8px_rgba(212,175,55,0.3)]" />
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-6 rounded-full bg-[#EB001B]" />
              <div className="w-6 h-6 rounded-full bg-[#F79E1B] -ml-2" />
            </div>
          </div>
          <p className="text-white/90 text-sm tracking-[0.15em] font-mono mb-4">
            4562 1122 4595 7852
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/40 text-[9px] uppercase tracking-wider">Card Holder</p>
              <p className="text-white/80 text-sm font-medium uppercase">
                {user?.name || "Bruce Wayne"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[9px] uppercase tracking-wider">Valid Thru</p>
              <p className="text-white/80 text-sm font-medium">12/28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activities</h3>
          <p className="text-xs text-slate-500 font-medium">Live</p>
        </div>
        <div className="space-y-3">
          {recent.length === 0 && (
            <p className="text-sm text-slate-500 font-medium">No recent loan activity yet.</p>
          )}
          {recent.map((loan, idx) => {
            const Icon = activityIcons[idx % activityIcons.length];
            return (
              <div key={loan.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#334155]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{loan.applicantName}</p>
                    <p className="text-xs text-slate-500 capitalize">{loan.status}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  {formatCurrency(loan.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Upcoming Payments</h3>
          <p className="text-xs text-slate-500 font-medium">Pending</p>
        </div>
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                    <Home className="w-3.5 h-3.5 text-[#334155]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Home Rent</p>
                    <p className="text-xs text-slate-500">Pending</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">$1,500</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                    <Car className="w-3.5 h-3.5 text-[#334155]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Car Insurance</p>
                    <p className="text-xs text-slate-500">Pending</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">$150</span>
              </div>
            </>
          )}
          {upcoming.map((loan) => (
            <div key={loan.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                  <Home className="w-3.5 h-3.5 text-[#334155]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{loan.applicantName}</p>
                  <p className="text-xs text-slate-500">Pending EMI</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                {formatCurrency(loan.monthlyPayment || loan.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
