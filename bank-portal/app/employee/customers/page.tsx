"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, UserCircle } from "lucide-react";
import { EmployeeLayout } from "../components/layout/EmployeeLayout";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_CUSTOMERS } from "../mock/customers";
import type { CustomerStatus } from "../types";

const STATUSES: (CustomerStatus | "All")[] = ["All", "Active", "Inactive", "Blacklisted"];
const BRANCHES = ["All", "Chennai Central", "Nagercoil", "Thoothukudi", "Coimbatore", "Madurai"];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "All">("All");
  const [branchFilter, setBranchFilter] = useState("All");

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.customerId.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchBranch = branchFilter === "All" || c.branch === branchFilter;
    return matchSearch && matchStatus && matchBranch;
  });

  return (
    <EmployeeLayout title="Customers" subtitle="View and manage customer profiles">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: MOCK_CUSTOMERS.length, color: "text-blue-700 bg-blue-50 border-blue-100" },
          { label: "Active", value: MOCK_CUSTOMERS.filter(c => c.status === "Active").length, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Inactive", value: MOCK_CUSTOMERS.filter(c => c.status === "Inactive").length, color: "text-slate-600 bg-slate-50 border-slate-200" },
          { label: "Blacklisted", value: MOCK_CUSTOMERS.filter(c => c.status === "Blacklisted").length, color: "text-red-700 bg-red-50 border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-2xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
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
              placeholder="Search by name, ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | "All")}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {BRANCHES.map((b) => <option key={b} value={b}>{b === "All" ? "All Branches" : b}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400 font-medium mt-2.5 ml-1">
          Showing {filtered.length} of {MOCK_CUSTOMERS.length} customers
        </p>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <UserCircle className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Customer Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Branch</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Credit Rating</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Loans</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((cust) => {
                const tierLabel = cust.creditScore >= 720 ? "STRONG" : cust.creditScore >= 650 ? "ADEQUATE" : cust.creditScore >= 550 ? "THIN" : "UNVERIFIED";
                const tierStyle = cust.creditScore >= 720 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : cust.creditScore >= 650 ? "bg-blue-50 text-blue-700 border-blue-200" : cust.creditScore >= 550 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200";

                return (
                <tr key={cust.customerId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {cust.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{cust.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{cust.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs text-slate-600">{cust.phone}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-600">{cust.branch}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${tierStyle}`}>
                      {tierLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-blue-700">{cust.activeLoans} active</span>
                      <span className="text-[10px] text-slate-400">{cust.totalLoans} total</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={cust.status} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      href={`/employee/customers/${cust.customerId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ); })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                    No customers match your filters.
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
