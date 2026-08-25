'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Home,
  ArrowLeftRight,
  Briefcase,
  MessageCircle,
  Settings,
  FileText,
  Search,
  Calendar,
  Bell,
  ChevronDown,
  MoreVertical,
  CreditCard,
  Building2,
  Landmark,
  Receipt,
  DollarSign,
  Zap,
  Wifi,
  Car,
  House,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Menu,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Briefcase as BriefcaseIcon,
  Bolt,
  Wifi as WifiIcon,
  Home as HomeIcon,
  Car as CarIcon,
  Eye,
  Download,
  Filter,
  Trash2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { LoanForm } from '../loans/LoanForm';
import type { CreateLoanInput } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const sideNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/loans', icon: ArrowLeftRight, label: 'Loans' },
  { href: '/investments', icon: Briefcase, label: 'Investments' },
  { href: '/cards', icon: MessageCircle, label: 'Cards', hasNotification: true },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/balance', icon: FileText, label: 'Balance' },
];

type ApiLoan = {
  id: string | number;
  applicant_name: string;
  amount: number;
  status: string;
  created_at: string;
};

// Get initials from name
const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Get status styles
const getStatusStyles = (status: string) => {
  const statusMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    Approved: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      dot: 'bg-green-400',
    },
    Rejected: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      dot: 'bg-red-400',
    },
    Pending: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      dot: 'bg-amber-400',
    },
    'In Progress': {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      dot: 'bg-blue-400',
    },
    Completed: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-400',
    },
    Default: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      dot: 'bg-gray-400',
    },
  };

  return statusMap[status] || statusMap.Default;
};

// Deterministic sparkline data - same on server and client
const SPARKLINE_DATA_1 = [45, 52, 38, 65, 42, 58, 70, 48, 55, 62, 40, 75, 50, 68, 35, 72, 60, 44, 56, 80];
const SPARKLINE_DATA_2 = [30, 45, 35, 28, 50, 42, 55, 38, 48, 32, 58, 40, 62, 35, 52, 28, 65, 45, 38, 55];
const SPARKLINE_DATA_3 = [55, 68, 72, 60, 78, 85, 65, 90, 75, 82, 70, 95, 80, 88, 60, 92, 70, 85, 65, 100];

export default function PaymentsDashboard() {
  const [loans, setLoans] = useState<ApiLoan[]>([]);
  const [creatingLoan, setCreatingLoan] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadLoans = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/loans`);
      if (!response.ok) throw new Error('Unable to load loans');
      const payload = await response.json();
        const rows = Array.isArray(payload?.data) ? payload.data : [];
        const uniqueRows = Array.from(
          new Map<string, ApiLoan>(rows.map((loan: ApiLoan) => [String(loan.id), loan])).values()
        );
        setLoans(uniqueRows);
    } catch {
      setLoans([]);
    }
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const handleCreateLoan = async (input: CreateLoanInput) => {
    setCreatingLoan(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_URL}/api/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: input.applicantName,
          email: input.applicantEmail,
          amount: input.amount,
          term_months: input.termMonths,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to create loan');
      await loadLoans();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create loan');
    } finally {
      setCreatingLoan(false);
    }
  };

  const chartData = useMemo(() => {
    const buckets = [
      { month: 'Jan', expense: 0 },
      { month: 'Feb', expense: 0 },
      { month: 'Mar', expense: 0 },
      { month: 'Apr', expense: 0 },
      { month: 'May', expense: 0 },
      { month: 'Jun', expense: 0 },
      { month: 'Jul', expense: 0 },
      { month: 'Aug', expense: 0 },
      { month: 'Sep', expense: 0 },
      { month: 'Oct', expense: 0 },
      { month: 'Nov', expense: 0 },
      { month: 'Dec', expense: 0 },
    ];
    loans.forEach((loan) => {
      const month = new Date(loan.created_at).getMonth();
      if (!Number.isNaN(month)) buckets[month].expense += Number(loan.amount) || 0;
    });
    return buckets;
  }, [loans]);

  const maxExpense = Math.max(...chartData.map((d) => d.expense), 1);
  const approvedBalance = loans
    .filter((loan) => loan.status === 'approved' || loan.status === 'active')
    .reduce((sum, loan) => sum + Number(loan.amount || 0), 0);

  const historyData = loans.slice(0, 8).map((loan, index) => ({
    id: loan.id,
    name: loan.applicant_name,
    email: '',
    time: new Date(loan.created_at).toLocaleTimeString(),
    amount: Number(loan.amount),
    formattedAmount: `$${Number(loan.amount).toLocaleString()}`,
    status: loan.status,
    active: index === 1,
    reference: `LN-${loan.id}`,
    type: 'Loan',
    date: new Date(loan.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
  }));

  // Recent activities
  const recentActivities = [
    { icon: Droplets, label: 'Water Bill', status: 'Successfully', amount: '+$120' },
    { icon: BriefcaseIcon, label: 'Income Salary', status: 'Received', amount: '+$4,500' },
    { icon: Bolt, label: 'Electric Bill', status: 'Successfully', amount: '-$150' },
    { icon: WifiIcon, label: 'Internet Bill', status: 'Successfully', amount: '-$60' },
  ];

  // Upcoming payments
  const upcomingPayments = [
    { icon: HomeIcon, label: 'Home Rent', status: 'Pending', amount: '$1,500' },
    { icon: CarIcon, label: 'Car Insurance', status: 'Pending', amount: '$150' },
  ];

  // Custom Tooltip for Area Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <p className="font-mono">${(payload[0].value / 1000).toFixed(1)}K</p>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">{label}</p>
        </div>
      );
    }
    return null;
  };

  // Mini sparkline component for stat cards
  const Sparkline = ({ data, color = '#E5E7EB' }: { data: number[]; color?: string }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="absolute bottom-0 left-0 w-full h-[40%] opacity-30" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`url(#sparklineGrad-${color.replace('#', '')})`}
          opacity="0.3"
        />
        <defs>
          <linearGradient id={`sparklineGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="h-screen w-full max-w-[100vw] bg-slate-50 font-sans overflow-hidden">
      {/* ============ BACKGROUND NOISE & ORBS ============ */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
      
      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none animate-orb-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none animate-orb-2" />

      {/* ============ MAIN 3-COLUMN LAYOUT ============ */}
      <div className="flex h-full w-full max-w-[100vw] overflow-hidden relative">
        {/* ============ LEFT NAVIGATION - Floating ============ */}
        <aside className="w-[80px] flex flex-col items-center py-6 flex-shrink-0">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5 mb-10">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>

          {/* Navigation Icons */}
          <nav className="flex flex-col items-center gap-6 flex-1">
            {sideNavItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === '/dashboard';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  className={`relative flex items-center transition-all duration-300 ease-out ${
                    active ? '' : 'hover:translate-x-0.5'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ease-out ${
                    active 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'
                  }`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  {item.hasNotification && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom - Logo */}
          <div className="mt-auto">
            <div className="w-10 h-10 relative rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <Image
                src="/images/fintilla.jpg"
                alt="Fintilla"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </aside>

        {/* ============ MAIN CONTENT ============ */}
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-8 no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-slate-500 font-medium">Payments updates</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-11 pr-4 py-2.5 bg-white/70 backdrop-blur-xl border border-white rounded-full text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-56 placeholder:text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
                />
              </div>

              {/* Icons */}
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 bg-white/70 backdrop-blur-xl border border-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                  <Calendar className="w-4 h-4 text-[#6B7280]" strokeWidth={1.5} />
                </button>
                <button className="relative w-9 h-9 bg-white/70 backdrop-blur-xl border border-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                  <Bell className="w-4 h-4 text-[#6B7280]" strokeWidth={1.5} />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white" />
                </button>
                <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-blue-500/30">
                    JD
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* ============ BENTO GRID METRICS - 3 Equal Cards ============ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 - Total Balance */}
            <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] relative overflow-hidden">
              <Sparkline data={SPARKLINE_DATA_1} color="#090A0B" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#334155]" strokeWidth={1.5} />
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer" strokeWidth={1.5} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Balance</p>
                <p className="text-4xl font-bold text-slate-900 mt-1 tracking-tight tabular-nums">
                  ${loans.reduce((s, l) => s + Number(l.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Card 2 - Pending */}
            <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] relative overflow-hidden">
              <Sparkline data={SPARKLINE_DATA_2} color="#F59E0B" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#334155]" strokeWidth={1.5} />
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer" strokeWidth={1.5} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending</p>
                <p className="text-4xl font-bold text-slate-900 mt-1 tracking-tight tabular-nums">
                  ${loans.filter((l) => l.status === 'pending').reduce((s, l) => s + Number(l.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Card 3 - Approved */}
            <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] relative overflow-hidden">
              <Sparkline data={SPARKLINE_DATA_3} color="#059669" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#334155]" strokeWidth={1.5} />
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer" strokeWidth={1.5} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Approved</p>
                <p className="text-4xl font-bold text-slate-900 mt-1 tracking-tight tabular-nums">
                  ${approvedBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* ============ CINEMATIC AREA CHART ============ */}
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 lg:p-8 mb-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Balance Overview</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                  ${approvedBalance.toLocaleString()}
                </p>
              </div>
              <button className="text-xs font-medium text-[#9CA3AF] bg-[#F8FAFC] px-4 py-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors flex items-center gap-1">
                PAST 30 DAYS
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
              </button>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData}
                  onMouseMove={(state) => {
                    // Crosshair effect handled by recharts
                  }}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#090A0B" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#090A0B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    dx={-8}
                    tickFormatter={(value) => {
                      if (value === 0) return '0';
                      return `${value/1000}K`;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#090A0B', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#090A0B"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#090A0B', stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Loan application form */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">New loan application</h2>
                <p className="text-sm text-slate-500 font-medium">Submit a loan without leaving the dashboard.</p>
              </div>
              <Link href="/loans/create" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                Open full form
              </Link>
            </div>
            {formError && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
            )}
            <LoanForm onSubmit={handleCreateLoan} loading={creatingLoan} />
          </section>

          {/* History - Premium Table */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Transaction History</h2>
                <p className="text-sm text-slate-500 font-medium">Complete transaction history of last 6 months</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/loans" className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-4 py-2 bg-white/70 backdrop-blur-xl border border-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </Link>
                <button className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-4 py-2 bg-white/70 backdrop-blur-xl border border-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Premium Table Container */}
            <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-white text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      <th className="py-4 px-4 lg:px-6 whitespace-nowrap">ID</th>
                      <th className="py-4 px-4 lg:px-6 whitespace-nowrap">Applicant</th>
                      <th className="py-4 px-4 lg:px-6 whitespace-nowrap">Amount</th>
                      <th className="py-4 px-4 lg:px-6 whitespace-nowrap">Status</th>
                      <th className="py-4 px-4 lg:px-6 whitespace-nowrap">Date</th>
                      <th className="py-4 px-4 lg:px-6 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100/50">
                    {historyData.map((item) => {
                      const statusStyles = getStatusStyles(item.status);
                      return (
                        <tr 
                          key={item.id}
                          className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer group focus:bg-gray-50/50 focus:outline-none"
                        >
                          <td className="py-4 px-4 lg:px-6 text-gray-400 font-medium whitespace-nowrap">
                            {String(item.id).slice(0, 8)}
                          </td>
                          <td className="py-4 px-4 lg:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                                {getInitials(item.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate max-w-[150px] lg:max-w-[200px]">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-[150px] lg:max-w-[200px]">
                                  {item.reference}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 lg:px-6 font-bold text-slate-900 tabular-nums tracking-tight whitespace-nowrap">
                            {item.formattedAmount}
                          </td>
                          <td className="py-4 px-4 lg:px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${statusStyles.bg} ${statusStyles.border} ${statusStyles.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 lg:px-6 text-gray-500 font-medium whitespace-nowrap">
                            {item.date}
                          </td>
                          <td
                            className="py-4 px-4 lg:px-6"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/loans/${item.id}`}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
                                title="View loan"
                              >
                                <Eye className="h-4 w-4" strokeWidth={1.5} />
                              </Link>
                              <Link
                                href={`/loans/${item.id}/edit`}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
                                title="Edit loan"
                              >
                                <ArrowLeftRight className="h-4 w-4" strokeWidth={1.5} />
                              </Link>
                              <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                                title="Delete loan"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {historyData.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg font-medium text-slate-600">No transactions found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}

              {/* View All Link */}
              <div className="px-4 lg:px-6 py-4 border-t border-gray-100/50 text-center">
                <Link href="/transactions" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                  View All Transactions
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* ============ RIGHT SIDEBAR ============ */}
        <aside className="w-[320px] max-w-[320px] p-6 flex flex-col overflow-y-auto overflow-x-hidden flex-shrink-0 no-scrollbar">
          {/* Credit Card - Hyper-realistic Premium */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 ring-1 ring-inset ring-white/20 shadow-[0_8px_40px_rgb(0,0,0,0.18)] relative overflow-hidden">
              {/* Noise texture overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '256px 256px',
                }}
              />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-8 h-6 bg-gradient-to-b from-[#D4AF37] to-[#B8960F] rounded-md shadow-[0_2px_8px_rgba(212,175,55,0.3)]" />
                <div className="flex items-center gap-0.5">
                  <div className="w-6 h-6 rounded-full bg-[#EB001B]" />
                  <div className="w-6 h-6 rounded-full bg-[#F79E1B] -ml-2" />
                </div>
              </div>
              <p className="text-gray-300 text-sm tracking-[0.15em] font-mono mb-4 relative z-10" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                4562 1122 4595 7852
              </p>
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-gray-500 text-[9px] uppercase tracking-wider">Card Holder</p>
                  <p className="text-gray-300 text-sm font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>BRUCE WAYNE</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[9px] uppercase tracking-wider">Valid Thru</p>
                  <p className="text-gray-300 text-sm font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>12/24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities - Premium */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activities</h3>
              <p className="text-xs text-slate-500 font-medium">02 Mar 2021</p>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, idx) => {
                const Icon = activity.icon;
                const isPositive = activity.amount.startsWith('+');
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{activity.label}</p>
                        <p className="text-xs text-gray-400">{activity.status}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold tabular-nums ${
                      isPositive ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md' : 'text-rose-600 bg-rose-50 px-2 py-1 rounded-md'
                    }`}>
                      {activity.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Payments - Premium */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Upcoming Payments</h3>
              <p className="text-xs text-slate-500 font-medium">13 Mar 2021</p>
            </div>
            <div className="space-y-3">
              {upcomingPayments.map((payment, idx) => {
                const Icon = payment.icon;
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{payment.label}</p>
                        <p className="text-xs text-gray-400">{payment.status}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums">{payment.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* ============ CUSTOM SCROLLBAR & ANIMATIONS ============ */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 999px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: transparent;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes orb-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 40px) scale(0.9);
          }
        }

        @keyframes orb-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 30px) scale(1.15);
          }
          66% {
            transform: translate(30px, -40px) scale(0.85);
          }
        }

        .animate-orb-1 {
          animation: orb-1 25s ease-in-out infinite;
        }

        .animate-orb-2 {
          animation: orb-2 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
