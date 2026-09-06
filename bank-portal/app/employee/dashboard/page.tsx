"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmployeeLayout } from "../components/layout/EmployeeLayout";
import { useRequireEmployeeAuth } from "../hooks/useEmployeeAuth";
import { useTranslation } from "@/i18n";
import { MOCK_LOANS } from "../mock/loans";
import { MOCK_CUSTOMERS } from "../mock/customers";
import { RiskBadge } from "../components/ui/RiskBadge";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatIDR } from "@/lib/utils/formatters";
import {
  Users,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ClipboardList,
  Activity,
  Search,
  MapPin,
  Building2,
} from "lucide-react";
import Link from "next/link";

// Fintilla band — derived from score internally; number never shown in UI
type FintillaBand = "VERIFIED-STRONG" | "VERIFIED-ADEQUATE" | "VERIFIED-THIN" | "UNVERIFIED" | "CONTRADICTED";
function toBand(score: number): FintillaBand {
  if (score >= 80) return "VERIFIED-STRONG";
  if (score >= 65) return "VERIFIED-ADEQUATE";
  if (score >= 50) return "VERIFIED-THIN";
  if (score >= 35) return "UNVERIFIED";
  return "CONTRADICTED";
}
const BAND_STYLE: Record<FintillaBand, string> = {
  "VERIFIED-STRONG": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "VERIFIED-ADEQUATE": "bg-blue-50 text-blue-700 border-blue-200",
  "VERIFIED-THIN": "bg-amber-50 text-amber-700 border-amber-200",
  "UNVERIFIED": "bg-slate-100 text-slate-600 border-slate-200",
  "CONTRADICTED": "bg-red-50 text-red-700 border-red-200",
};
const BAND_DOT: Record<FintillaBand, string> = {
  "VERIFIED-STRONG": "bg-emerald-500",
  "VERIFIED-ADEQUATE": "bg-blue-500",
  "VERIFIED-THIN": "bg-amber-500",
  "UNVERIFIED": "bg-slate-400",
  "CONTRADICTED": "bg-red-500",
};

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const { employee } = useRequireEmployeeAuth();
  const { language: lang, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const role = employee?.role || "Loan Officer";

  // Deduplicate: keep only the latest loan per customer
  const seenCustomers = new Set<string>();
  const recentLoans = MOCK_LOANS.filter((loan) => {
    if (seenCustomers.has(loan.customerId)) return false;
    seenCustomers.add(loan.customerId);
    return true;
  }).slice(0, 7);

  const riskStats = {
    low: MOCK_LOANS.filter((l) => l.riskLevel === "Low").length,
    medium: MOCK_LOANS.filter((l) => l.riskLevel === "Medium").length,
    high: MOCK_LOANS.filter((l) => l.riskLevel === "High").length,
    critical: MOCK_LOANS.filter((l) => l.riskLevel === "Critical").length,
  };

  const totalLoans = MOCK_LOANS.length;
  const totalFinancing = MOCK_LOANS.reduce((sum, l) => sum + l.amount, 0);

  const SUMMARY_CARDS = [
    {
      label: t('employeeDashboard.totalBusinessCustomers'),
      value: MOCK_CUSTOMERS.length.toString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-100",
      delta: lang === "en" ? "Active records" : "Rekam aktif",
    },
    {
      label: lang === "en" ? "Applications Under Review" : "Pengajuan Dalam Tinjauan",
      value: MOCK_LOANS.filter(l => l.status === "Under Review" || l.status === "Pending").length.toString(),
      icon: FileText,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      delta: lang === "en" ? "Requires action" : "Butuh tindakan",
    },
    {
      label: lang === "en" ? "Pending Assessments" : "Penilaian Tertunda",
      value: MOCK_LOANS.filter(l => l.status === "Assessment Pending").length.toString(),
      icon: ClipboardList,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      delta: lang === "en" ? "Pending completion" : "Menunggu penyelesaian",
    },
    {
      label: lang === "en" ? "High Risk Businesses" : "Usaha Risiko Tinggi",
      value: riskStats.high + riskStats.critical,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-100",
      delta: lang === "en" ? "Needs review" : "Butuh tinjauan",
    },
    {
      label: t('employeeDashboard.totalFundingDisbursed'),
      value: formatIDR(totalFinancing),
      isLarge: true,
      icon: Activity,
      color: "from-violet-500 to-violet-600",
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-100",
      delta: lang === "en" ? "Cumulative" : "Kumulatif",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/employee/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Group by Business Type
  const byBusinessType = MOCK_CUSTOMERS.reduce((acc, c) => {
    acc[c.businessType] = (acc[c.businessType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by Region (Province)
  const byRegion = MOCK_CUSTOMERS.reduce((acc, c) => {
    acc[c.province] = (acc[c.province] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <EmployeeLayout title={`Dashboard - ${role}`} subtitle={t('employeeDashboard.subtitle')}>
      {/* Customer Search */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6 mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-3">{t('employeeDashboard.businessSearch')}</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t('employeeDashboard.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            {lang === "en" ? "Search" : "Cari"}
          </button>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white/70 backdrop-blur-xl border ${card.border} rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all`}
            >
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${card.text}`} strokeWidth={2} />
              </div>
              <p className={`font-bold text-slate-900 tracking-tight break-words leading-tight ${'isLarge' in card && card.isLarge ? 'text-sm' : 'text-2xl'}`}>{card.value}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{card.label}</p>
              <p className={`text-[10px] font-medium mt-1 ${card.text}`}>{card.delta}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Conditional rendering based on role */}
        {(role === "Administrator" || role === "Loan Officer" || role === "Branch Manager" || role === "Operations Officer") && (
          <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">{lang === "en" ? "Recent Applications" : "Pengajuan Terbaru"}</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{lang === "en" ? "Latest business financing submissions" : "Submisi pembiayaan usaha terbaru"}</p>
              </div>
              <Link
                href="/employee/assessments"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
              >
                {lang === "en" ? "View all" : "Lihat Semua"} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{lang === "en" ? "Applicant & Business" : "Pemohon & Usaha"}</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">{lang === "en" ? "Requested" : "Pengajuan"}</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">{lang === "en" ? "Assessment Band" : "Band Penilaian"}</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">{lang === "en" ? "Risk" : "Risiko"}</th>
                    <th className="px-6 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">{lang === "en" ? "Status & Action" : "Status & Aksi"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/80">
                  {recentLoans.map((loan) => {
                    const initials = loan.customerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                    const band = toBand(loan.overallScore);
                    
                    return (
                      <tr key={loan.loanId} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                              {initials}
                            </div>
                            {/* Identity */}
                            <div>
                              <div className="flex items-center gap-2">
                                <Link href={`/employee/customers/${loan.customerId}`}>
                                  <p className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors">
                                    {loan.customerName}
                                  </p>
                                </Link>
                                <span className="text-[9px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {loan.loanId}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {loan.businessName}
                                <span className="mx-1.5 text-slate-300">·</span>
                                <span className="text-slate-400">{loan.businessType}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <p className="text-sm font-bold text-slate-700">{formatIDR(loan.amount)}</p>
                        </td>

                        <td className="px-4 py-4 text-center">
                           <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2 py-1 rounded-lg border ${BAND_STYLE[band]}`}>
                             <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${BAND_DOT[band]}`} />
                             {band}
                           </span>
                         </td>

                        <td className="px-4 py-4 text-center">
                          <RiskBadge level={loan.riskLevel} />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <StatusBadge status={loan.status} />
                            <Link
                              href={`/employee/assessments/${loan.loanId}`}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Breakdown Overview */}
        <div className="space-y-4">
          {/* Applications by Business Type */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{lang === "en" ? "By Business Type" : "Berdasarkan Jenis Usaha"}</h3>
                <p className="text-xs text-slate-500">{lang === "en" ? "Distribution across sectors" : "Distribusi di berbagai sektor"}</p>
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(byBusinessType).map(([type, count]) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">{type}</span>
                    <span className="text-xs font-bold text-blue-700">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((count / MOCK_CUSTOMERS.length) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications by Region */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{lang === "en" ? "By Region" : "Berdasarkan Wilayah"}</h3>
                <p className="text-xs text-slate-500">{lang === "en" ? "Geographical distribution" : "Distribusi geografis"}</p>
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(byRegion).map(([region, count]) => (
                <div key={region}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">{region}</span>
                    <span className="text-xs font-bold text-emerald-700">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((count / MOCK_CUSTOMERS.length) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
