"use client";

import { useState } from "react";
import { Save, Settings, ShieldCheck, Bell, Briefcase } from "lucide-react";
import { EmployeeLayout } from "../components/layout/EmployeeLayout";
import { MOCK_CONFIGURATION } from "../mock/configuration";
import type { EmployeeConfiguration } from "../types";
import toast from "react-hot-toast";

import { useRequireEmployeeAuth } from "../hooks/useEmployeeAuth";
import { Lock } from "lucide-react";

export default function ConfigurationPage() {
  const { employee } = useRequireEmployeeAuth();
  const [config, setConfig] = useState<EmployeeConfiguration>(MOCK_CONFIGURATION);
  const [isSaving, setIsSaving] = useState(false);

  const isReadOnly = employee?.role === "Read-Only Auditor";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      toast.error("Read-Only Auditor cannot edit global configurations");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success("Configuration saved successfully (mock)");
  };

  return (
    <EmployeeLayout title="Configuration" subtitle="Manage bank-wide settings and policies">
      <form onSubmit={handleSave} className="max-w-5xl space-y-6">
        
        {/* Read-Only Notice for Auditors */}
        {isReadOnly && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 shadow-sm">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">Read-Only Auditor Access Mode</p>
              <p className="text-[11px] text-amber-700">
                You are logged in as a Read-Only Auditor. Modification of bank-wide policies and thresholds is restricted.
              </p>
            </div>
          </div>
        )}

        {/* Actions header */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
          <p className="text-sm text-slate-500 font-medium ml-2">
            ⚠️ Changes apply globally across the platform. (Active Role: {employee?.role})
          </p>
          <button
            type="submit"
            disabled={isSaving || isReadOnly}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/30"
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isReadOnly ? "Read-Only Mode" : isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Loan Settings */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Loan Settings</h3>
                <p className="text-xs text-slate-500">Configure global lending parameters</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Loan Amount (Rp)</label>
                <input
                  type="number"
                  value={config.loanSettings.maxLoanAmount}
                  onChange={(e) => setConfig({ ...config, loanSettings: { ...config.loanSettings, maxLoanAmount: Number(e.target.value) } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Tenure (Months)</label>
                <input
                  type="number"
                  value={config.loanSettings.maxTenureMonths}
                  onChange={(e) => setConfig({ ...config, loanSettings: { ...config.loanSettings, maxTenureMonths: Number(e.target.value) } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Min. Monthly Revenue (Rp)</label>
                <input
                  type="number"
                  value={config.loanSettings.minMonthlyRevenue}
                  onChange={(e) => setConfig({ ...config, loanSettings: { ...config.loanSettings, minMonthlyRevenue: Number(e.target.value) } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Min Interest (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.loanSettings.interestRateMin}
                    onChange={(e) => setConfig({ ...config, loanSettings: { ...config.loanSettings, interestRateMin: Number(e.target.value) } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Interest (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.loanSettings.interestRateMax}
                    onChange={(e) => setConfig({ ...config, loanSettings: { ...config.loanSettings, interestRateMax: Number(e.target.value) } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Risk Settings */}
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Risk Settings</h3>
                  <p className="text-xs text-slate-500">Global credit scoring thresholds</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Min Credit Score Threshold</label>
                  <input
                    type="number"
                    value={config.riskSettings.creditScoreThreshold}
                    onChange={(e) => setConfig({ ...config, riskSettings: { ...config.riskSettings, creditScoreThreshold: Number(e.target.value) } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">High Risk Below</label>
                    <input
                      type="number"
                      value={config.riskSettings.highRiskThreshold}
                      onChange={(e) => setConfig({ ...config, riskSettings: { ...config.riskSettings, highRiskThreshold: Number(e.target.value) } })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Critical Risk Below</label>
                    <input
                      type="number"
                      value={config.riskSettings.criticalRiskThreshold}
                      onChange={(e) => setConfig({ ...config, riskSettings: { ...config.riskSettings, criticalRiskThreshold: Number(e.target.value) } })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">System Notifications</h3>
                  <p className="text-xs text-slate-500">Automated alerts and emails</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "loanApprovalNotifications", label: "Loan Approval Notifications", desc: "Email customers upon approval" },
                  { id: "paymentReminder", label: "Payment Reminders", desc: "Automated SMS/Email reminders" },
                  { id: "riskAlerts", label: "Internal Risk Alerts", desc: "Notify analysts of critical cases" },
                  { id: "dailyReports", label: "Daily Executive Reports", desc: "Send EOD reports to branch managers" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={config.notificationSettings[item.id as keyof typeof config.notificationSettings]}
                        onChange={(e) => setConfig({
                          ...config,
                          notificationSettings: {
                            ...config.notificationSettings,
                            [item.id]: e.target.checked
                          }
                        })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </form>
    </EmployeeLayout>
  );
}
