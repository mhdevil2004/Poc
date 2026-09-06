"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Calendar, AlertTriangle, FileText, CheckCircle, ShieldAlert } from "lucide-react";
import { EmployeeLayout } from "../../components/layout/EmployeeLayout";
import { RiskBadge } from "../../components/ui/RiskBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { MOCK_RISK_CASES } from "../../mock/riskCases";

export default function RiskCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const riskCase = MOCK_RISK_CASES.find((c) => c.caseId === id);

  if (!riskCase) {
    return (
      <EmployeeLayout title="Case Not Found">
        <div className="text-center py-20">
          <p className="text-slate-500 text-sm">Risk case &quot;{id}&quot; was not found.</p>
          <Link href="/employee/risk" className="text-blue-600 text-sm font-semibold mt-3 inline-block">
            ← Back to Risk Analysis
          </Link>
        </div>
      </EmployeeLayout>
    );
  }

  const flagColors = ["bg-red-100 text-red-700 border-red-200", "bg-orange-100 text-orange-700 border-orange-200", "bg-amber-100 text-amber-700 border-amber-200"];

  return (
    <EmployeeLayout title={riskCase.caseId} subtitle={`Risk analysis case for loan ${riskCase.loanId}`}>
      <div className="mb-6">
        <Link href="/employee/risk" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Risk Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{riskCase.caseId}</h2>
                <p className="text-sm text-slate-500 mt-0.5">Created {riskCase.createdAt} · Updated {riskCase.updatedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={riskCase.riskLevel} />
                <StatusBadge status={riskCase.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Case ID</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{riskCase.caseId}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Loan Reference</p>
                <Link href={`/employee/assessments/${riskCase.loanId}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-0.5 block">{riskCase.loanId}</Link>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Fintilla Band</p>
                <span className={`inline-block text-[10px] font-bold font-mono px-2 py-0.5 mt-0.5 rounded border ${riskCase.overallScore >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : riskCase.overallScore >= 65 ? "bg-blue-50 text-blue-700 border-blue-200" : riskCase.overallScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" : riskCase.overallScore >= 35 ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {riskCase.overallScore >= 80 ? "VERIFIED-STRONG" : riskCase.overallScore >= 65 ? "VERIFIED-ADEQUATE" : riskCase.overallScore >= 50 ? "VERIFIED-THIN" : riskCase.overallScore >= 35 ? "UNVERIFIED" : "CONTRADICTED"}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Customer ID</p>
                <Link href={`/employee/customers/${riskCase.customerId}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-0.5 block">{riskCase.customerId}</Link>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Score Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: "Credit Capacity", score: riskCase.creditworthiness, color: "bg-blue-500" },
                { label: "Psychometric Evaluation", score: riskCase.psychometricScore, color: "bg-indigo-500" },
                { label: "Data Integrity", score: riskCase.integrityScore, color: "bg-violet-500" },
                { label: "Risk Profile (Inverted)", score: 100 - riskCase.riskScore, color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">{s.label}</span>
                    <span className="text-xs font-bold font-mono text-slate-800">
                      {s.score >= 80 ? "VERIFIED-STRONG" : s.score >= 65 ? "VERIFIED-ADEQUATE" : s.score >= 50 ? "VERIFIED-THIN" : "UNVERIFIED"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Flags */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-slate-900">Risk Flags</h3>
            </div>
            {riskCase.flags.length > 0 ? (
              <div className="flex flex-col gap-2">
                {riskCase.flags.map((flag, i) => (
                  <div key={flag} className={`px-4 py-3 rounded-xl text-sm font-semibold border ${flagColors[i % flagColors.length]}`}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {flag}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No risk flags detected.</p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Analyst Notes</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{riskCase.notes}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Business & Customer</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {riskCase.businessName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{riskCase.businessName}</p>
                <p className="text-[10px] text-slate-500">{riskCase.businessType}</p>
                <Link href={`/employee/customers/${riskCase.customerId}`} className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1 inline-block">
                  {riskCase.customerName} →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Assigned Analyst</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {riskCase.assignedAnalystName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{riskCase.assignedAnalystName}</p>
                <p className="text-[10px] text-slate-500">{riskCase.assignedAnalystId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
                Update Status
              </button>
              <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                Add Note
              </button>
              <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                Escalate Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
