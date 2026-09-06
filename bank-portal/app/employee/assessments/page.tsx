"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  ClipboardList,
  Filter,
  CalendarDays,
  RotateCcw,
  Clock,
  CheckCircle2,
  Flag,
  X,
} from "lucide-react";
import { EmployeeLayout } from "../components/layout/EmployeeLayout";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_ASSESSMENTS } from "../mock/assessments";
import type { AssessmentStatus } from "../types";
import { useTranslation } from "@/i18n";
import { formatIDR } from "@/lib/utils/formatters";

// ── Fintilla Score Band definitions ──────────────────────────────────────────
// Band names MUST remain unchanged. No numeric scores are shown to the user.
export type FintillaScoreBand =
  | "VERIFIED-STRONG"
  | "VERIFIED-ADEQUATE"
  | "VERIFIED-THIN"
  | "UNVERIFIED"
  | "CONTRADICTED";

const FINTILLA_BANDS: FintillaScoreBand[] = [
  "VERIFIED-STRONG",
  "VERIFIED-ADEQUATE",
  "VERIFIED-THIN",
  "UNVERIFIED",
  "CONTRADICTED",
];

/**
 * Derives a Fintilla band from the internal numeric overall score.
 * This mapping is internal logic only — the number is NEVER shown in the UI.
 */
function deriveFintillaBand(overallScore: number): FintillaScoreBand {
  if (overallScore >= 80) return "VERIFIED-STRONG";
  if (overallScore >= 65) return "VERIFIED-ADEQUATE";
  if (overallScore >= 50) return "VERIFIED-THIN";
  if (overallScore >= 35) return "UNVERIFIED";
  return "CONTRADICTED";
}

// ── Band visual styles ────────────────────────────────────────────────────────
const BAND_STYLES: Record<
  FintillaScoreBand,
  { badge: string; dot: string; label: string }
> = {
  "VERIFIED-STRONG": {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
    dot: "bg-emerald-500",
    label: "Affordability solid, high reconciliation confidence, clean integrity",
  },
  "VERIFIED-ADEQUATE": {
    badge: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
    dot: "bg-blue-500",
    label: "Affordability & reconciliation hold up, just below top tier",
  },
  "VERIFIED-THIN": {
    badge: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
    dot: "bg-amber-500",
    label: "Some verification exists but sparse — thin reconciliation",
  },
  UNVERIFIED: {
    badge: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-100",
    dot: "bg-slate-400",
    label: "Insufficient independent evidence to confirm claims",
  },
  CONTRADICTED: {
    badge: "bg-red-50 text-red-700 border-red-200 ring-red-100",
    dot: "bg-red-500",
    label: "Evidence actively conflicts with borrower claims",
  },
};

// ── Portal status options (simplified to 3 as required) ───────────────────────
type PortalStatus = "Pending" | "Complete" | "Flagged";

const PORTAL_STATUSES: PortalStatus[] = ["Pending", "Complete", "Flagged"];

/**
 * Maps any internal AssessmentStatus to the simplified portal status.
 */
function toPortalStatus(status: AssessmentStatus): PortalStatus {
  if (status === "Flagged" || status === "Manual Review Required") return "Flagged";
  if (
    status === "Assessment Completed" ||
    status === "Review Completed"
  )
    return "Complete";
  return "Pending";
}

// ── Score Band badge component ────────────────────────────────────────────────
function ScoreBandBadge({ band, size = "sm" }: { band: FintillaScoreBand; size?: "xs" | "sm" }) {
  const style = BAND_STYLES[band];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold border rounded-lg whitespace-nowrap
        ${size === "xs" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1"}
        ${style.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
      {band}
    </span>
  );
}

// ── Status pill for portal statuses ──────────────────────────────────────────
function PortalStatusPill({ status }: { status: PortalStatus }) {
  const styles: Record<PortalStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Flagged: "bg-red-50 text-red-700 border-red-200",
  };
  const icons: Record<PortalStatus, React.ReactNode> = {
    Pending: <Clock className="w-3 h-3" />,
    Complete: <CheckCircle2 className="w-3 h-3" />,
    Flagged: <Flag className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AssessmentsPage() {
  const { t } = useTranslation();

  // Filter state
  const [loanRef, setLoanRef] = useState("");
  const [scoreBandFilter, setScoreBandFilter] = useState<FintillaScoreBand | "">("");
  const [statusFilter, setStatusFilter] = useState<PortalStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Augment assessments with derived band + portal status
  const augmented = useMemo(
    () =>
      MOCK_ASSESSMENTS.map((a) => ({
        ...a,
        fintillaBand: deriveFintillaBand(a.overallScore),
        portalStatus: toPortalStatus(a.status),
      })),
    []
  );

  // Summary stats
  const stats = useMemo(() => ({
    total: augmented.length,
    pending: augmented.filter((a) => a.portalStatus === "Pending").length,
    complete: augmented.filter((a) => a.portalStatus === "Complete").length,
    flagged: augmented.filter((a) => a.portalStatus === "Flagged").length,
  }), [augmented]);

  // Filtered list
  const filtered = useMemo(() => {
    return augmented.filter((a) => {
      // Loan reference / name / amount search
      if (loanRef.trim()) {
        const ref = loanRef.trim().toLowerCase();
        const formattedAmount = (a.requestedAmount ? formatIDR(a.requestedAmount) : "").toLowerCase();
        const digitsOnly = ref.replace(/[^0-9]/g, "");

        const matches =
          a.loanId.toLowerCase().includes(ref) ||
          a.customerName.toLowerCase().includes(ref) ||
          a.businessName.toLowerCase().includes(ref) ||
          formattedAmount.includes(ref) ||
          (digitsOnly.length >= 3 && String(a.requestedAmount || 0).includes(digitsOnly));

        if (!matches) return false;
      }

      // Fintilla score band
      if (scoreBandFilter && a.fintillaBand !== scoreBandFilter) return false;

      // Portal status
      if (statusFilter && a.portalStatus !== statusFilter) return false;

      // Date range
      if (dateFrom && a.assessmentDate < dateFrom) return false;
      if (dateTo && a.assessmentDate > dateTo) return false;

      return true;
    });
  }, [augmented, loanRef, scoreBandFilter, statusFilter, dateFrom, dateTo]);

  const hasFilters = loanRef || scoreBandFilter || statusFilter || dateFrom || dateTo;

  const resetFilters = () => {
    setLoanRef("");
    setScoreBandFilter("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <EmployeeLayout
      title="Assessments"
      subtitle="Review loan applications using Fintilla Assessment Bands"
    >
      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: ClipboardList,
            cls: "text-slate-700 bg-slate-50 border-slate-200",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            cls: "text-amber-700 bg-amber-50 border-amber-200",
          },
          {
            label: "Complete",
            value: stats.complete,
            icon: CheckCircle2,
            cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
          },
          {
            label: "Flagged",
            value: stats.flagged,
            icon: Flag,
            cls: "text-red-700 bg-red-50 border-red-200",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-3 border rounded-2xl p-4 ${s.cls}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold leading-none">{s.value}</p>
                <p className="text-xs font-semibold mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-600" />
          <p className="text-sm font-bold text-slate-800">Filter & Search</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Loan Reference Search */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="loan-ref-search"
              type="text"
              placeholder="Search Loan Reference…"
              value={loanRef}
              onChange={(e) => setLoanRef(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Fintilla Score Band */}
          <select
            id="score-band-filter"
            value={scoreBandFilter}
            onChange={(e) => setScoreBandFilter(e.target.value as FintillaScoreBand | "")}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          >
            <option value="">All Score Bands</option>
            {FINTILLA_BANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PortalStatus | "")}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          >
            <option value="">All Statuses</option>
            {PORTAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <span className="text-slate-400 text-xs font-medium flex-shrink-0">to</span>
            <div className="relative flex-1">
              <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Active filter bar */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>

            {/* Active filter chips */}
            {loanRef && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Ref: {loanRef}
                <button onClick={() => setLoanRef("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {scoreBandFilter && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Band: {scoreBandFilter}
                <button onClick={() => setScoreBandFilter("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {(dateFrom || dateTo) && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Date: {dateFrom || "…"} → {dateTo || "…"}
                <button onClick={() => { setDateFrom(""); setDateTo(""); }}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Fintilla Band Legend */}
      <div className="bg-white/60 border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4 mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Fintilla Assessment Band Reference
        </p>
        <div className="flex flex-wrap gap-2">
          {FINTILLA_BANDS.map((band) => (
            <button
              key={band}
              onClick={() =>
                setScoreBandFilter(scoreBandFilter === band ? "" : band)
              }
              title={BAND_STYLES[band].label}
              className={`transition-all duration-150 rounded-lg border ${
                scoreBandFilter === band ? "ring-2 ring-offset-1" : "opacity-80 hover:opacity-100"
              } ${BAND_STYLES[band].badge}`}
            >
              <ScoreBandBadge band={band} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Assessments List</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filtered.length} of {augmented.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Loan Reference & Applicant
                </th>
                <th className="px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Date
                </th>
                <th className="px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Assessment Band
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {filtered.map((a) => {
                const initials = a.customerName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={a.assessmentId}
                    className="group hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Loan Ref + Applicant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          {/* Loan ID — prominent, monospace */}
                          <p className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block mb-0.5">
                            {a.loanId}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link href={`/employee/customers/${a.customerId}`}>
                              <p className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors">
                                {a.customerName}
                              </p>
                            </Link>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {a.businessName}
                            <span className="mx-1 text-slate-300">·</span>
                            {a.businessType}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4">
                      <p className="text-xs font-medium text-slate-700">{a.city}</p>
                      <p className="text-[10px] text-slate-400">{a.province}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-center">
                      <p className="text-xs text-slate-600">
                        {new Date(a.assessmentDate).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Fintilla Band — NO numbers */}
                    <td className="px-4 py-4 text-center">
                      <ScoreBandBadge band={a.fintillaBand} />
                    </td>

                    {/* Status + Action */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <PortalStatusPill status={a.portalStatus} />
                        <Link
                          href={`/employee/assessments/${a.loanId}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                    <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                    No assessments match your filters.
                    {hasFilters && (
                      <button
                        onClick={resetFilters}
                        className="block mx-auto mt-2 text-xs text-blue-600 font-semibold hover:text-blue-700"
                      >
                        Reset filters
                      </button>
                    )}
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
