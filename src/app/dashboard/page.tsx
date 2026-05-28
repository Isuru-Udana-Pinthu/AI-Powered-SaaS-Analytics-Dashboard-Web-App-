'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface KPI {
  label: string;
  value: string;
  change?: string;
  status?: 'up' | 'down' | 'neutral';
}

interface ChartDataPoint {
  name: string;
  value1: number;
  value2?: number;
}

interface ReportData {
  _id: string;
  title: string;
  summary: string;
  kpis: KPI[];
  chartData: ChartDataPoint[];
  createdAt: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchReport = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/history/${id}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to fetch report details.');
      }

      setData(result.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestOrRedirect = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/history');
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to fetch analysis history.');
      }

      if (result.history && result.history.length > 0) {
        // Automatically fetch details for the latest report
        const latestId = result.history[0]._id;
        fetchReport(latestId);
      } else {
        // No reports found, show empty state
        setData(null);
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to check report history.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport(reportId);
    } else {
      fetchLatestOrRedirect();
    }
  }, [reportId]);

  const getKPIIcon = (status?: string) => {
    switch (status) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getKPIBadgeStyle = (status?: string) => {
    switch (status) {
      case 'up':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'down':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[50vh] items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 dark:text-violet-400" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Loading report analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel border-card-border p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 mx-auto">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Error Loading Report
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => reportId ? fetchReport(reportId) : fetchLatestOrRedirect()}
          className="px-4 py-2 text-xs font-semibold text-violet-600 hover:text-white hover:bg-violet-600 border border-violet-600 hover:border-transparent rounded-xl transition duration-150 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    /* Empty State */
    return (
      <div className="max-w-2xl mx-auto glass-panel border-card-border p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-sm bg-white/20 dark:bg-slate-900/10 relative overflow-hidden">
        {/* Glow orbs in empty state */}
        <div className="absolute top-0 -left-4 w-48 h-48 bg-violet-600/5 rounded-full filter blur-2xl" />
        <div className="absolute -bottom-8 -right-4 w-48 h-48 bg-indigo-600/5 rounded-full filter blur-2xl" />

        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20 mx-auto group-hover:scale-105 transition duration-150 animate-bounce duration-[4000ms]">
          <UploadCloud className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
            Welcome to Apex Analytics!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            You don't have any business report analyses saved yet. Upload a CSV spreadsheet or paste text data to generate your first AI-Powered SaaS Dashboard!
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard/upload')}
          className="flex items-center justify-center py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-50 rounded-2xl font-semibold shadow-lg shadow-violet-600/20 active:scale-[0.98] transition duration-150 text-sm mx-auto group"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create First Analysis
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition duration-150" />
        </button>
      </div>
    );
  }

  // Determine chart colors dynamically
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const chartStrokeColor = '#8b5cf6'; // Violet 500
  const chartFillColor1 = 'rgba(139, 92, 246, 0.2)';
  const chartFillColor2 = 'rgba(99, 102, 241, 0.25)';
  const chartBarColor1 = '#6366f1'; // Indigo 500
  const chartBarColor2 = '#06b6d4'; // Cyan 500

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title & Metadata Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Analyzed on {new Date(data.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
            {data.title}
          </h2>
        </div>
        <button
          onClick={() => router.push('/dashboard/upload')}
          className="flex items-center justify-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-card-border text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs active:scale-[0.98] transition duration-150 shadow-sm"
        >
          <UploadCloud className="w-4 h-4 mr-2 text-violet-500" />
          Ingest New Data
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className="glass-panel border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 bg-white/30 dark:bg-slate-900/10 flex flex-col justify-between h-32 relative overflow-hidden"
          >
            {/* Ambient card accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full filter blur-xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {kpi.label}
              </span>
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-card-border">
                {getKPIIcon(kpi.status)}
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-4">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {kpi.value}
              </span>
              {kpi.change && (
                <span className={`flex items-center px-2 py-0.5 text-[10px] font-bold rounded-lg border ${getKPIBadgeStyle(kpi.status)}`}>
                  {kpi.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Charts Block */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart 1: Area/Line Chart */}
          <div className="glass-panel border-card-border p-6 rounded-3xl shadow-sm bg-white/30 dark:bg-slate-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-card-border/50 pb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-500/10 text-violet-500">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Trend & Growth Performance
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Timeline Area Graph
              </span>
            </div>

            {mounted && (
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartStrokeColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartStrokeColor} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(148, 163, 184, 0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(148, 163, 184, 0.5)" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                        borderColor: isDark ? '#1e293b' : '#e2e8f0',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                    <Area 
                      name="Primary Metric" 
                      type="monotone" 
                      dataKey="value1" 
                      stroke={chartStrokeColor} 
                      fillOpacity={1} 
                      fill="url(#colorVal1)" 
                      strokeWidth={2}
                    />
                    {data.chartData[0] && 'value2' in data.chartData[0] && (
                      <Area 
                        name="Secondary Metric" 
                        type="monotone" 
                        dataKey="value2" 
                        stroke="#06b6d4" 
                        fillOpacity={1} 
                        fill="url(#colorVal2)" 
                        strokeWidth={2}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Bar Chart */}
          <div className="glass-panel border-card-border p-6 rounded-3xl shadow-sm bg-white/30 dark:bg-slate-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-card-border/50 pb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Distribution Breakdown
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Segment Comparison
              </span>
            </div>

            {mounted && (
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(148, 163, 184, 0.5)" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(148, 163, 184, 0.5)" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                        borderColor: isDark ? '#1e293b' : '#e2e8f0',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                    <Bar 
                      name="Primary Metric" 
                      dataKey="value1" 
                      fill={chartBarColor1} 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={32}
                    />
                    {data.chartData[0] && 'value2' in data.chartData[0] && (
                      <Bar 
                        name="Secondary Metric" 
                        dataKey="value2" 
                        fill={chartBarColor2} 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={32}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* AI Analysis Summary Card */}
        <div className="glass-panel border-card-border p-6 rounded-3xl shadow-sm bg-gradient-to-br from-white/30 via-white/20 to-violet-500/[0.02] dark:from-slate-900/10 dark:via-slate-900/5 dark:to-violet-500/[0.01] flex flex-col h-fit space-y-6">
          <div className="flex items-center space-x-3 border-b border-card-border/50 pb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Gemini AI Summary
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Executive Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
            <div className="space-y-4">
              <p className="text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">
                {data.summary}
              </p>
              <div className="border-t border-card-border/50 pt-4 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Key Takeaways
                </span>
                <ul className="space-y-2.5">
                  {data.kpis.slice(0, 3).map((kpi, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5 mr-2" />
                      <span>
                        <strong>{kpi.label}</strong> is currently at <strong>{kpi.value}</strong>
                        {kpi.change ? ` (${kpi.change.replace('+', '').replace('-', '')} ${kpi.status === 'up' ? 'growth' : kpi.status === 'down' ? 'decline' : 'stable'})` : ''}.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-[50vh] items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 dark:text-violet-400" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Preparing view...
        </p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
