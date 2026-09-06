"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, X, ChevronRight, Building2, CalendarDays, RotateCcw } from "lucide-react";
import { AdminLayout } from "../components/AdminLayout";
import { ScoreBandBadge } from "../components/ScoreBandBadge";
import { MOCK_ADMIN_ASSESSMENTS, SCORE_BAND_ORDER, type ScoreBand, type AdminAssessmentStatus } from "../../admin-data/mockAdminAssessments";
import { formatAssessmentDate, isInDateRange } from "../../admin-lib/dateTime";
import { useTranslation } from "@/i18n";
import { formatIDR } from "@/lib/utils/formatters";

const STATUS_OPTIONS: Array<{ value: AdminAssessmentStatus | ""; label: string; labelId: string }> = [
  { value: "", label: "All Statuses", labelId: "Semua Status" },
  { value: "Pending", label: "Pending", labelId: "Tertunda" },
  { value: "Complete", label: "Complete", labelId: "Selesai" },
  { value: "Flagged", label: "Flagged", labelId: "Ditandai" },
];

const STATUS_STYLES: Record<AdminAssessmentStatus, string> = {
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Complete: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Flagged: "bg-red-50 text-red-800 border-red-200",
};

export default function AdminAssessmentsPage() {
  const { language } = useTranslation();
  const [loanRef, setLoanRef] = useState("");
  const [status, setStatus] = useState<AdminAssessmentStatus | "">("");
  const [scoreBand, setScoreBand] = useState<ScoreBand | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const t = (en: string, id: string) => language === "en" ? en : id;

  const filtered = useMemo(() => {
    return MOCK_ADMIN_ASSESSMENTS.filter((a) => {
      if (loanRef && !a.loanRef.toLowerCase().includes(loanRef.toLowerCase())) return false;
      if (status && a.status !== status) return false;
      if (scoreBand && a.scoreBand !== scoreBand) return false;
      if (!isInDateRange(a.assessmentDate, startDate || undefined, endDate || undefined)) return false;
      return true;
    });
  }, [loanRef, status, scoreBand, startDate, endDate]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const hasFilters = loanRef || status || scoreBand || startDate || endDate;

  const resetFilters = () => {
    setLoanRef("");
    setStatus("");
    setScoreBand("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleFilterChange = (fn: () => void) => { fn(); setPage(1); };

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          {t("Assessments", "Penilaian")}
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {t("Review and manage loan assessments using Fintilla Score Bands", "Tinjau dan kelola penilaian pinjaman menggunakan Band Penilaian Fintilla")}
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Loan Reference */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t("Search Loan Reference...", "Cari Referensi Pinjaman...")}
              value={loanRef}
              onChange={(e) => handleFilterChange(() => setLoanRef(e.target.value))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => handleFilterChange(() => setStatus(e.target.value as AdminAssessmentStatus | ""))}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{t(opt.label, opt.labelId)}</option>
            ))}
          </select>

          {/* Score Band */}
          <select
            value={scoreBand}
            onChange={(e) => handleFilterChange(() => setScoreBand(e.target.value as ScoreBand | ""))}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
          >
            <option value="">{t("All Score Bands", "Semua Band Penilaian")}</option>
            {SCORE_BAND_ORDER.map((band) => (
              <option key={band} value={band}>{band}</option>
            ))}
          </select>

          {/* Date range */}
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange(() => setStartDate(e.target.value))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
              placeholder={t("Start Date", "Tanggal Mulai")}
            />
          </div>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange(() => setEndDate(e.target.value))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
              placeholder={t("End Date", "Tanggal Akhir")}
            />
          </div>
        </div>

        {/* Active filters + reset */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">{filtered.length} {t("results", "hasil")}</span>
            <button
              onClick={resetFilters}
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t("Reset Filters", "Reset Filter")}
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden lg:grid lg:grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1.3fr_0.7fr_40px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200">
          {[
            t("Loan Reference", "Referensi Pinjaman"),
            t("Borrower", "Peminjam"),
            t("Business", "Usaha"),
            t("Date", "Tanggal"),
            t("Score Band", "Band Penilaian"),
            t("Status", "Status"),
            "",
          ].map((col, i) => (
            <div key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{col}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {paginated.length === 0 ? (
            <div className="py-16 text-center">
              <X className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">{t("No assessments match your filters.", "Tidak ada penilaian yang sesuai filter Anda.")}</p>
              {hasFilters && (
                <button onClick={resetFilters} className="mt-3 text-xs text-violet-600 hover:text-violet-700 font-semibold">
                  {t("Reset filters", "Reset filter")}
                </button>
              )}
            </div>
          ) : (
            paginated.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/admin/assessments/${assessment.id}`}
                className="flex flex-col lg:grid lg:grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1.3fr_0.7fr_40px] gap-2 lg:gap-4 px-5 py-4 hover:bg-violet-50/30 transition-colors group cursor-pointer"
              >
                {/* Loan Ref */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-violet-700 font-mono group-hover:text-violet-800 transition-colors">
                    {assessment.loanRef}
                  </span>
                </div>

                {/* Borrower */}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-slate-600">
                      {assessment.borrower.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-800 truncate">{assessment.borrower}</span>
                </div>

                {/* Business */}
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 truncate">{assessment.businessName}</p>
                    <p className="text-[10px] text-slate-400">{assessment.businessType}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <span className="text-sm text-slate-600 font-mono">{formatAssessmentDate(assessment.assessmentDate)}</span>
                </div>

                {/* Score Band */}
                <div className="flex items-center">
                  <ScoreBandBadge band={assessment.scoreBand} size="sm" />
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[assessment.status]}`}>
                    {assessment.status === "Pending" ? t("Pending", "Tertunda")
                      : assessment.status === "Complete" ? t("Complete", "Selesai")
                      : t("Flagged", "Ditandai")}
                  </span>
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex items-center justify-end">
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              {t("Showing", "Menampilkan")} {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} {t("of", "dari")} {filtered.length}
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    page === p
                      ? "bg-violet-600 text-white shadow"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Score Band Legend */}
      <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {t("Fintilla Score Band Reference", "Referensi Band Penilaian Fintilla")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SCORE_BAND_ORDER.map((band) => (
            <ScoreBandBadge key={band} band={band} showDescription size="sm" />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
