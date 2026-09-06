"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, ShieldAlert, Filter } from "lucide-react";
import { EmployeeLayout } from "../components/layout/EmployeeLayout";
import { RiskBadge } from "../components/ui/RiskBadge";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_RISK_CASES } from "../mock/riskCases";
import type { RiskLevel, RiskCaseStatus } from "../types";
import { useTranslation } from "@/i18n";

const RISK_LEVELS: (RiskLevel | "All")[] = ["All", "Low", "Medium", "High", "Critical"];
const STATUSES: (RiskCaseStatus | "All")[] = ["All", "Open", "In Review", "Escalated", "Resolved", "Closed"];

export default function RiskPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [statusFilter, setStatusFilter] = useState<RiskCaseStatus | "All">("All");

  const filtered = MOCK_RISK_CASES.filter((c) => {
    const matchSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.caseId.toLowerCase().includes(search.toLowerCase()) ||
      c.loanId.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "All" || c.riskLevel === riskFilter;
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <EmployeeLayout title={t('risk.title')} subtitle={t('risk.subtitle')}>
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: t('risk.openCases'), value: MOCK_RISK_CASES.filter(c => c.status === "Open").length, color: "text-blue-700 bg-blue-50 border-blue-100" },
          { label: t('risk.underReview'), value: MOCK_RISK_CASES.filter(c => c.status === "In Review").length, color: "text-amber-700 bg-amber-50 border-amber-100" },
          { label: t('risk.escalated'), value: MOCK_RISK_CASES.filter(c => c.status === "Escalated").length, color: "text-red-700 bg-red-50 border-red-100" },
          { label: t('risk.resolved'), value: MOCK_RISK_CASES.filter(c => c.status === "Resolved" || c.status === "Closed").length, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-2xl p-4`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-semibold mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('risk.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "All")}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {RISK_LEVELS.map((r) => <option key={r} value={r}>{r === "All" ? t('assessments.allRiskLevels') : r}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RiskCaseStatus | "All")}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? t('assessments.allStatuses') : s}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400 font-medium mt-2.5 ml-1">
          {t('assessments.showing')} {filtered.length} {t('assessments.of')} {MOCK_RISK_CASES.length}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">{t('risk.title')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('risk.caseId')}</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('risk.loanRef')}</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('risk.customerAndBusiness')}</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fintilla Band</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('assessments.risk')}</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">{t('risk.analyst')}</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('assessments.status')}</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('risk.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((rc) => {
                const band = rc.overallScore >= 80 ? "VERIFIED-STRONG" : rc.overallScore >= 65 ? "VERIFIED-ADEQUATE" : rc.overallScore >= 50 ? "VERIFIED-THIN" : rc.overallScore >= 35 ? "UNVERIFIED" : "CONTRADICTED";
                const bandStyle = band === "VERIFIED-STRONG" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : band === "VERIFIED-ADEQUATE" ? "bg-blue-50 text-blue-700 border-blue-200" : band === "VERIFIED-THIN" ? "bg-amber-50 text-amber-700 border-amber-200" : band === "UNVERIFIED" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-red-50 text-red-700 border-red-200";

                return (
                <tr key={rc.caseId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-900 text-xs font-mono">{rc.caseId}</td>
                  <td className="px-4 py-3.5">
                    <Link href={`/employee/assessments/${rc.loanId}`} className="text-blue-600 hover:text-blue-700 text-xs font-mono font-semibold transition-colors">
                      {rc.loanId}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-800 font-semibold text-xs">{rc.customerName}</p>
                    <p className="text-slate-500 text-[10px]">{rc.businessName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-block text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${bandStyle}`}>
                      {band}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <RiskBadge level={rc.riskLevel} />
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    <span className="text-xs text-slate-600">{rc.assignedAnalystName}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={rc.status} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Link
                      href={`/employee/risk/${rc.caseId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {t('common.open')} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ); })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                    {t('risk.noRiskCases')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
}
