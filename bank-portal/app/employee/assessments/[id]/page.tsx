"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, MapPin, Building2, IndianRupee, Banknote, Calendar, Activity, ShieldCheck, FileText, CheckCircle, ShieldAlert, AlertTriangle, ChevronRight, Flag, AlertOctagon } from "lucide-react";
import { EmployeeLayout } from "../../components/layout/EmployeeLayout";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { RiskBadge } from "../../components/ui/RiskBadge";
import { MOCK_ASSESSMENTS } from "../../mock/assessments";
import { MOCK_CUSTOMERS } from "../../mock/customers";
import { MOCK_LOANS } from "../../mock/loans";
import { formatIDR } from "@/lib/utils/formatters";
import { useTranslation } from "@/i18n";

import { useRequireEmployeeAuth } from "../../hooks/useEmployeeAuth";
import toast from "react-hot-toast";

type TabType = "overview" | "business" | "financial" | "loan" | "scores" | "risk" | "flags" | "history";

export default function AssessmentReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { employee } = useRequireEmployeeAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const assessment = MOCK_ASSESSMENTS.find((a) => a.loanId === id);
  const customer = MOCK_CUSTOMERS.find((c) => c.customerId === assessment?.customerId);
  const loan = MOCK_LOANS.find((l) => l.loanId === id);

  const [currentStatus, setCurrentStatus] = useState<string>(assessment?.status || "Under Review");

  if (!assessment || !customer || !loan) {
    return (
      <EmployeeLayout title="Assessment Not Found">
        <div className="text-center py-20">
          <p className="text-slate-500 text-sm">Assessment reference &quot;{id}&quot; not found.</p>
          <Link href="/employee/assessments" className="text-blue-600 text-sm font-semibold mt-3 inline-block">← Back to Assessments</Link>
        </div>
      </EmployeeLayout>
    );
  }

  const role = employee?.role || "Read-Only Auditor";

  const TABS: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "scores", label: "Scores" },
    { id: "risk", label: "Risk Factors", count: assessment.riskFactors.length },
    { id: "flags", label: "Red Flags", count: assessment.flags.length },
    { id: "loan", label: "Loan Info" },
    { id: "business", label: "Business" },
    { id: "history", label: "History" },
  ];

  return (
    <EmployeeLayout title={`Assessment Case: ${loan.loanId}`} subtitle={`Customer: ${assessment.customerName}`}>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/employee/assessments" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-bold font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          Active Role: {role}
        </div>
      </div>

      {/* DYNAMIC ROLE-BASED DECISION ACTION PANEL */}
      <div className="mb-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        {role === "Underwriter" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  UW
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Underwriter Decision Action Bar</h3>
                  <p className="text-xs text-slate-500">Authorized to approve, adjust terms, or reject this application</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Underwriter Clearance Active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setCurrentStatus("Assessment Completed");
                  toast.success(`Application ${loan.loanId} approved by Underwriter`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Disburse
              </button>

              <button
                onClick={() => toast.success("Term adjustment requested")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                Adjust Terms / Amount
              </button>

              <button
                onClick={() => {
                  setCurrentStatus("Rejected");
                  toast.error(`Application ${loan.loanId} rejected.`);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                Reject Application
              </button>
            </div>
          </div>
        )}

        {role === "Risk Officer" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  RO
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Risk Officer Audit Action Bar</h3>
                  <p className="text-xs text-slate-500">Authorized to override risk classifications, set fraud flags, or approve risk exceptions</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Risk Clearance Active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setCurrentStatus("Manual Review Required");
                  toast(`Application ${loan.loanId} flagged for Risk Officer Audit.`, { icon: "⚠️" });
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Flag className="w-4 h-4" />
                Flag for Risk Review
              </button>

              <button
                onClick={() => {
                  setCurrentStatus("Assessment Completed");
                  toast.success("Risk exception approved by Risk Officer");
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Risk Exception
              </button>

              <button
                onClick={() => toast(`Full fraud scan initiated`, { icon: "🛡️" })}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                Trigger Deep Fraud Scan
              </button>
            </div>
          </div>
        )}

        {(role === "Administrator" || role === "Read-Only Auditor" || role === "Loan Officer") && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-500" />
              <div>
                <h3 className="text-xs font-bold text-slate-800">Viewing under &quot;{role}&quot; Security Clearance</h3>
                <p className="text-[11px] text-slate-500">Sign in as an Underwriter or Risk Officer to execute approval, rejection, or fraud clearance actions.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            <div className="flex flex-col items-center text-center mb-5">
              {(() => {
                const band = assessment.overallScore >= 80 ? "VERIFIED-STRONG" : assessment.overallScore >= 65 ? "VERIFIED-ADEQUATE" : assessment.overallScore >= 50 ? "VERIFIED-THIN" : assessment.overallScore >= 35 ? "UNVERIFIED" : "CONTRADICTED";
                const bandStyle = band === "VERIFIED-STRONG" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : band === "VERIFIED-ADEQUATE" ? "bg-blue-50 text-blue-700 border-blue-200" : band === "VERIFIED-THIN" ? "bg-amber-50 text-amber-700 border-amber-200" : band === "UNVERIFIED" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-red-50 text-red-700 border-red-200";
                return (
                  <div className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold shadow-sm mb-3 ${bandStyle}`}>
                    {band}
                  </div>
                );
              })()}
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1">Skor Fintilla Band</h2>
              <RiskBadge level={assessment.riskLevel} />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">{t('assessments.assessmentStatus')}</span>
                <div className="mt-1"><StatusBadge status={currentStatus as any} /></div>
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-medium">{t('assessments.customer')}</span>
                <Link href={`/employee/customers/${customer.customerId}`} className="block text-sm font-bold text-blue-600 hover:text-blue-700 mt-0.5">
                  {customer.name}
                </Link>
                <span className="text-[10px] font-mono text-slate-500">{customer.customerId}</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-medium">{t('assessments.business')}</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{assessment.businessName}</p>
                <p className="text-[10px] text-slate-500">{assessment.businessType}</p>
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-medium">{t('assessments.assignedAnalyst')}</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{assessment.assignedAnalystName}</p>
                <p className="text-[10px] text-slate-500">{assessment.assignedAnalystId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] mb-6 p-2 flex gap-2 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-600"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" /> {t('assessments.overviewTitle')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{t('assessments.requested')}</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">{formatIDR(loan.amount)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{t('assessments.tenor')}</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">{loan.tenureMonths} {t('assessments.monthsShort')}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{t('assessments.creditBureau')}</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {customer.creditScore >= 720 ? "STRONG CREDIT" : customer.creditScore >= 650 ? "ADEQUATE CREDIT" : customer.creditScore >= 550 ? "THIN CREDIT" : "UNVERIFIED CREDIT"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{t('assessments.purpose')}</p>
                    <p className="text-xs font-bold text-slate-800 mt-1 leading-tight">{loan.purpose}</p>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">{t('assessments.analystNotes')}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{assessment.notes}</p>
                </div>
              </div>
            )}

            {/* SCORES */}
            {activeTab === "scores" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900">{t('assessments.scoreBreakdown')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { label: t('assessments.creditCapacity'), score: assessment.creditScore, color: "bg-blue-500" },
                      { label: t('assessments.psychometric'), score: assessment.psychometricScore, color: "bg-indigo-500" },
                      { label: t('assessments.dataIntegrity'), score: assessment.integrityScore, color: "bg-violet-500" },
                      { label: t('assessments.riskProfileInverted'), score: 100 - assessment.riskScore, color: "bg-emerald-500" },
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

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 mb-3">{t('assessments.assessmentInsights')}</h4>
                    <div className="space-y-2.5">
                      {assessment.insights.map((insight, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          {insight.type === "positive" ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-xs text-slate-600">{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RISK ANALYSIS */}
            {activeTab === "risk" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-indigo-600" /> {t('assessments.riskFactors')} ({assessment.riskFactors.length})
                  </h3>
                  <Link href={`/employee/risk/${assessment.loanId.replace("LN-ID", "RC")}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    {t('assessments.openRiskCase')}
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assessment.riskFactors.map((factor, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-slate-800">{factor.name}</h4>
                        <RiskBadge level={factor.level} />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed flex-1">{factor.description}</p>
                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{t('assessments.riskWeight')}</span>
                        <span className={`text-xs font-bold ${factor.score >= 70 ? "text-red-600" : factor.score >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
                          {factor.score}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FLAGS */}
            {activeTab === "flags" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500" /> {t('assessments.activeRedFlags')}
                </h3>
                {assessment.flags.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">{t('assessments.noRedFlags')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assessment.flags.map((flag, idx) => (
                      <div key={idx} className="bg-red-50/50 rounded-xl p-4 border border-red-100/50 flex gap-3">
                        <AlertOctagon className={`w-5 h-5 flex-shrink-0 ${flag.severity === "Critical" ? "text-red-600" : flag.severity === "High" ? "text-orange-500" : "text-amber-500"}`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-slate-800">{flag.type}</h4>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                              {flag.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{flag.description}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{t('assessments.detectedAt')}{flag.createdAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LOAN */}
            {activeTab === "loan" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900">{t('assessments.financingDetails')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs text-slate-500">{t('assessments.requestedAmount')}</span>
                      <span className="text-sm font-bold text-slate-800">{formatIDR(loan.amount)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs text-slate-500">{t('assessments.tenor')}</span>
                      <span className="text-sm font-bold text-slate-800">{loan.tenureMonths} {t('assessments.months')}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs text-slate-500">{t('assessments.purpose')}</span>
                      <span className="text-sm font-bold text-slate-800">{loan.purpose}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs text-slate-500">{t('assessments.existingLoan')}</span>
                      <span className="text-sm font-bold text-slate-800">{formatIDR(loan.existingOutstandingLoan)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs text-slate-500">{t('assessments.estInstallment')}</span>
                      <span className="text-sm font-bold text-slate-800">{formatIDR(loan.amount / loan.tenureMonths * 1.15)}{t('assessments.perMonth')}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs text-slate-500">{t('assessments.applicationDate')}</span>
                      <span className="text-sm font-bold text-slate-800">{new Date(loan.applicationDate).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS & FINANCIAL */}
            {(activeTab === "business" || activeTab === "financial") && (
              <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                <Banknote className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 font-medium">{t('assessments.detailedDataInProfile')}</p>
                <Link href={`/employee/customers/${customer.customerId}?tab=${activeTab}`} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all">
                  {t('assessments.viewCustomerProfile')}
                </Link>
              </div>
            )}

            {/* HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900">{t('assessments.assessmentHistory')}</h3>
                <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100">
                  {assessment.history.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{entry.event}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 font-mono">{entry.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-medium text-slate-600">{entry.actor} ({entry.actorRole})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
