'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  History, 
  Search, 
  Trash2, 
  ArrowUpRight, 
  FileText, 
  Sparkles,
  Loader2,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface KPI {
  label: string;
  value: string;
  change?: string;
  status?: 'up' | 'down' | 'neutral';
}

interface HistoryItem {
  _id: string;
  title: string;
  summary: string;
  kpis: KPI[];
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Loading status for deleting individual items (by ID)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/history');
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to load analysis history.');
      }

      setHistory(result.history || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not load your history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!window.confirm("Are you sure you want to permanently delete this report from your history?")) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to delete report.');
      }

      // Remove from state list
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete report.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectReport = (id: string) => {
    router.push(`/dashboard?id=${id}`);
  };

  // Filter history based on search query
  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query)
    );
  });

  const getKPIIcon = (status?: string) => {
    switch (status) {
      case 'up':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1" />;
      case 'down':
        return <TrendingDown className="w-3.5 h-3.5 text-rose-500 mr-1" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-slate-400 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[50vh] items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600 dark:text-violet-400" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Retrieving your historical reports...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Title Block */}
      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Analysis History
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review, analyze, and manage your previously generated Gemini AI reports. Click any report to reload its charts and metrics.
        </p>
      </div>

      {error && (
        <div className="flex items-start p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and search bar */}
      {history.length > 0 && (
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report titles or keywords..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition duration-200 text-sm shadow-sm"
          />
        </div>
      )}

      {/* Grid List */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item._id}
              onClick={() => handleSelectReport(item._id)}
              className="glass-panel border-card-border p-6 rounded-3xl shadow-sm hover:shadow-md hover:scale-[1.005] hover:border-violet-500/30 dark:hover:border-violet-500/30 cursor-pointer transition-all duration-200 bg-white/20 dark:bg-slate-900/10 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Highlight background lines */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-3xl pointer-events-none" />

              {/* Title & action button */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-150 truncate max-w-[200px] sm:max-w-xs">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(item._id, e)}
                    disabled={deletingId === item._id}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 active:scale-95 transition-all duration-150"
                    title="Delete report"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  {/* Inspect button */}
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-card-border text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:border-violet-500/20 group-hover:scale-105 transition-all duration-150">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Truncated Summary */}
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>

              {/* KPI Mini badging */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-card-border/50">
                {item.kpis.slice(0, 3).map((kpi, index) => (
                  <div 
                    key={index} 
                    className="flex items-center px-2.5 py-1 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-card-border text-[10px] font-semibold text-slate-600 dark:text-slate-400 shadow-sm"
                  >
                    {getKPIIcon(kpi.status)}
                    <span className="font-bold mr-1">{kpi.value}</span>
                    <span className="text-slate-400 font-normal">{kpi.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty history */
        <div className="max-w-md mx-auto glass-panel border-card-border p-8 rounded-3xl text-center space-y-4 shadow-sm bg-white/20 dark:bg-slate-900/10">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-600 border border-violet-500/20 mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {searchQuery ? 'No Matching Reports' : 'History is Empty'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {searchQuery 
              ? `No reports matched your search term "${searchQuery}". Please check your spelling or search for another keyword.` 
              : 'You have not uploaded or analyzed any reports yet. Once you analyze a dataset with Gemini, it will appear here.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push('/dashboard/upload')}
              className="flex items-center justify-center py-2 px-4 bg-violet-600 hover:bg-violet-500 text-slate-50 rounded-xl font-semibold active:scale-95 transition duration-150 text-xs mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Upload & Analyze Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}
