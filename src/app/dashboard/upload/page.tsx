'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  RefreshCw,
  ArrowRight,
  Clock
} from 'lucide-react';

const LOADING_TIPS = [
  "Gemini is identifying anomalous trends in your dataset...",
  "Structuring custom Recharts visualization schemas...",
  "Calculating executive-level KPI metrics and YoY change indices...",
  "Drafting professional executive summary recommendations...",
  "Finalizing data warehouse secure sync with MongoDB..."
];

export default function UploadPage() {
  const router = useRouter();
  
  // Tab states: 'csv' | 'text'
  const [activeTab, setActiveTab] = useState<'csv' | 'text'>('csv');
  
  // Input states
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedCsvData, setParsedCsvData] = useState<any[] | null>(null);
  
  // Flow states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle through loading tips
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Drag handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Parse CSV function
  const parseCSV = (selectedFile: File) => {
    setError('');
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn("CSV Parsing warning:", results.errors);
        }
        if (results.data && results.data.length > 0) {
          setParsedCsvData(results.data);
          setFile(selectedFile);
        } else {
          setError("The CSV file seems to be empty or improperly formatted.");
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
        parseCSV(droppedFile);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseCSV(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setParsedCsvData(null);
    setError('');
  };

  // Submit Handler
  const handleAnalyze = async () => {
    setError('');
    
    if (activeTab === 'csv' && (!parsedCsvData || parsedCsvData.length === 0)) {
      setError("Please upload and parse a valid CSV file first.");
      return;
    }
    
    if (activeTab === 'text' && !inputText.trim()) {
      setError("Please paste a text report or business context to analyze.");
      return;
    }

    setLoading(true);
    setTipIndex(0);

    try {
      const payload = activeTab === 'csv' 
        ? { type: 'csv', rawData: parsedCsvData }
        : { type: 'text', text: inputText };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Analysis request failed');
      }

      // Redirect to main dashboard with the new report's ID
      router.push(`/dashboard?id=${result.data._id}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center p-6 text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-xl w-full space-y-8 animate-fade-in">
          {/* Pulsing AI Logo */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/20">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-3xl opacity-30 blur-sm animate-ping duration-[3000ms]" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              AI Analytics Engine Working
            </h2>
            <div className="flex items-center justify-center space-x-2 text-violet-600 dark:text-violet-400 font-semibold text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Dataset...</span>
            </div>
          </div>

          {/* Cyclical Tips Box */}
          <div className="glass-panel border-card-border p-6 rounded-2xl shadow-lg relative overflow-hidden bg-white/40 dark:bg-slate-900/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <div className="flex items-start space-x-3 text-left">
              <Clock className="w-5 h-5 text-violet-500 mt-0.5 shrink-0 animate-spin duration-[8000ms]" />
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Current Operation
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1 transition-all duration-300">
                  {LOADING_TIPS[tipIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Skeleton Loading */}
          <div className="space-y-4 opacity-40 select-none pointer-events-none">
            {/* KPI Cards skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
              ))}
            </div>
            {/* Large graph skeleton */}
            <div className="h-44 bg-slate-200 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Title block */}
      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Ingest Business Data
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload a spreadsheet or paste your latest sales, marketing, or general report. Google Gemini AI will instantly model the metrics and render interactive charts.
        </p>
      </div>

      {error && (
        <div className="flex items-start p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-sm space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="glass-panel border-card-border rounded-3xl overflow-hidden shadow-sm bg-white/20 dark:bg-slate-900/10">
        {/* Tab Headers */}
        <div className="flex border-b border-card-border bg-slate-100/50 dark:bg-slate-900/30 p-1.5">
          <button
            onClick={() => { setActiveTab('csv'); setError(''); }}
            className={`flex-1 flex items-center justify-center py-3.5 px-4 text-sm font-semibold rounded-2xl transition duration-150 ${
              activeTab === 'csv'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm border border-card-border'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload CSV File
          </button>
          <button
            onClick={() => { setActiveTab('text'); setError(''); }}
            className={`flex-1 flex items-center justify-center py-3.5 px-4 text-sm font-semibold rounded-2xl transition duration-150 ${
              activeTab === 'text'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm border border-card-border'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Paste Report Text
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'csv' ? (
            /* CSV Upload Zone */
            <div className="space-y-4">
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition duration-150 group cursor-pointer ${
                    dragActive
                      ? 'border-violet-500 bg-violet-500/5'
                      : 'border-slate-300 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-900/10'
                  }`}
                >
                  {/* Hidden Input file selector */}
                  <input
                    type="file"
                    id="csv-file-input"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-card-border text-slate-400 group-hover:text-violet-500 group-hover:border-violet-500/40 transition duration-150 shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4 text-center">
                    Drag and drop your CSV file here, or <span className="text-violet-500 font-bold hover:underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 text-center">
                    Supports raw tables, transactional rows, or monthly summaries (Max 5MB)
                  </p>
                </div>
              ) : (
                /* File Loaded Overview Card */
                <div className="glass-panel border-card-border p-6 rounded-2xl bg-emerald-500/[0.02] border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB • {parsedCsvData?.length || 0} rows parsed
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearFile}
                    className="flex items-center px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 transition duration-150"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Clear
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Report Copy-Paste Text Area */
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Paste Report / Context Text
              </label>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Example: E-commerce report. Q1 sales hit $45k in January with 12% margin. February dropped to $38k due to cold weather, but margin rose to 15%. March bounced back to $52k, adding 400 new subscribers. Ad spend was steady at $3k per month. Direct traffic represents 60% of all conversions..."
                  rows={8}
                  className="w-full p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition duration-200 text-sm font-normal leading-relaxed resize-y"
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-card-border shadow-sm">
                  {inputText.length} characters
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Footer Controls */}
        <div className="flex items-center justify-between border-t border-card-border p-6 bg-slate-50/40 dark:bg-slate-900/20">
          <p className="hidden sm:block text-xs text-slate-400 font-medium">
            * All uploads are processed securely and saved inside your isolated sandbox database.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={
              activeTab === 'csv' 
                ? !parsedCsvData 
                : !inputText.trim()
            }
            className="w-full sm:w-auto flex items-center justify-center py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-50 rounded-2xl font-semibold shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none text-sm group"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze with Gemini AI
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition duration-150" />
          </button>
        </div>
      </div>
    </div>
  );
}
