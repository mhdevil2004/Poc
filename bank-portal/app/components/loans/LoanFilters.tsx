"use client";

import { Search, ChevronDown } from "lucide-react";
import type { LoanStatus } from "@/types";

interface LoanFiltersProps {
  search: string;
  status: LoanStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LoanStatus | "all") => void;
}

const statusOptions: { value: LoanStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "defaulted", label: "Defaulted" },
  { value: "closed", label: "Closed" },
  { value: "completed", label: "Completed" },
];

export function LoanFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: LoanFiltersProps) {
  // Get the label for the current status
  const getStatusLabel = (value: LoanStatus | "all") => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option?.label || "All Statuses";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Search Input - Premium */}
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/80 hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>

      {/* Status Dropdown - Premium Custom Select */}
      <div className="relative min-w-[180px]">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LoanStatus | "all")}
          className="w-full px-4 py-3 pr-11 bg-white border border-gray-200/80 hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 rounded-xl text-sm text-gray-900 appearance-none transition-all duration-200 outline-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}