"use client";

import Link from "next/link";
import { AlertOctagon, ArrowRight, ShieldAlert, ArrowUpRight, Search } from "lucide-react";
import { EmployeeLayout } from "../../components/layout/EmployeeLayout";
import { RiskBadge } from "../../components/ui/RiskBadge";
import { MOCK_ASSESSMENTS } from "../../mock/assessments";
import { formatIDR } from "@/lib/utils/formatters";
import { useState } from "react";
import { useTranslation } from "@/i18n";
import { CheckCircle } from "lucide-react";

export default function ManualReviewQueuePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const queue = MOCK_ASSESSMENTS.filter(
    (a) => a.status === "Manual Review Required" || a.status === "Flagged"
  ).filter((a) => {
    const q = search.toLowerCase();
    return !q ||
      a.loanId.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q) ||
      a.businessName.toLowerCase().includes(q);
  });

  return (
    <EmployeeLayout title={t('manualReview.title')} subtitle={t('manualReview.subtitle')}>
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{queue.length} {t('manualReview.casesRequiringReview')}</p>
            <p className="text-xs text-slate-500">{t('manualReview.casesRequiringReviewDesc')}</p>
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('manualReview.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {queue.map((a) => (
          <div key={a.assessmentId} className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative group">
            <div className={`absolute top-0 left-0 w-full h-1 ${a.status === "Manual Review Required" ? "bg-red-500" : "bg-orange-500"}`} />
            
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mb-1.5 inline-block">
                    {a.loanId}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{a.customerName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{a.businessName}</p>
                </div>
                <span className={`text-[10px] font-bold font-mono px-2 py-1 rounded border ${a.overallScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {a.overallScore >= 60 ? "VERIFIED-THIN" : a.overallScore >= 35 ? "UNVERIFIED" : "CONTRADICTED"}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t('manualReview.systemRisk')}</span>
                  <RiskBadge level={a.riskLevel} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t('manualReview.redFlags')}</span>
                  <span className="font-semibold text-red-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {a.flags.length} {t('manualReview.active')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                  <span className="text-slate-500">{t('manualReview.mainReason')}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate" title={a.flags[0]?.type || t('manualReview.lowOverallScore')}>
                    {a.flags[0]?.type || t('manualReview.lowOverallScore')}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-red-50 transition-colors">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                {a.assessmentDate}
              </span>
              <Link
                href={`/employee/assessments/${a.loanId}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {t('manualReview.startReview')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
        
        {queue.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">{t('manualReview.cleanQueue')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('manualReview.noAssessmentsReqReview')}</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
