import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BarChart3, UploadCloud, ShieldAlert, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-violet-500/30 selection:text-violet-200">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse duration-[8000ms]" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Top Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/60 backdrop-blur-md bg-slate-950/20">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 group-hover:scale-105 transition duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-white">
            Apex Analytics
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition duration-150"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="flex items-center justify-center py-2 px-4 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold active:scale-[0.98] transition duration-150 shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-xs font-bold text-violet-400 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin duration-[5000ms]" />
          Powered by Gemini 1.5 Flash
        </div>

        {/* Heading */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-400">
            Automate Business Intelligence<br />
            with Contextual Generative AI
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Apex is a premium full-stack SaaS platform that transforms spreadsheet data and raw report texts into beautiful interactive charting dashboards and professional executive summaries instantly.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center py-3 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-50 rounded-2xl font-bold shadow-lg shadow-violet-600/30 active:scale-[0.98] transition-all duration-150 text-sm group"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition duration-150" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center py-3 px-8 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl font-semibold active:scale-[0.98] transition duration-150 text-sm text-slate-200"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Visual Dashboard Mockup placeholder */}
        <div className="pt-12 animate-fade-in">
          <div className="relative mx-auto max-w-4xl rounded-3xl border border-slate-800/80 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="rounded-2xl border border-slate-900 overflow-hidden bg-slate-950/80 aspect-[16/9] flex items-center justify-center relative">
              {/* Inner glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 via-transparent to-indigo-900/10 pointer-events-none" />
              
              <div className="space-y-4 z-10 px-6">
                <div className="flex items-center justify-center space-x-2 text-violet-400">
                  <BarChart3 className="w-10 h-10 animate-bounce duration-[3000ms]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Instantly Generates Recharts and Summaries
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Upload transaction ledgers, performance rosters, or text context, and our system dynamically compiles schemas for seamless graphing.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Feature Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 bg-slate-950/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="backdrop-blur-xl bg-slate-900/10 border border-slate-900 rounded-3xl p-8 space-y-4 hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-400 border border-violet-500/10">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Ingest spreadsheet lists
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop CSV spreadsheets directly. Our client-side engines parse data rows automatically to structure ingestion blocks cleanly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="backdrop-blur-xl bg-slate-900/10 border border-slate-900 rounded-3xl p-8 space-y-4 hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-400 border border-violet-500/10">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              AI Insight Pipeline
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leverage Google Gemini API executing forced JSON schemas. Get guaranteed, type-safe summaries, KPIs, and coordinates without failure.
            </p>
          </div>

          {/* Card 3 */}
          <div className="backdrop-blur-xl bg-slate-900/10 border border-slate-900 rounded-3xl p-8 space-y-4 hover:border-violet-500/20 hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-400 border border-violet-500/10">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Interactive Recharts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Render beautiful, fully animated and responsive Area, Line, and Bar graphs tailored for both light and dark backgrounds smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-slate-900/40 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between">
        <p>© 2026 Apex Analytics Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Built as a Premium Full-Stack AI-Powered SaaS Template.</p>
      </footer>
    </div>
  );
}
