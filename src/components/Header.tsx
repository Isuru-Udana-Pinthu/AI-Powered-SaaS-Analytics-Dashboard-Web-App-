'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useSession } from 'next-auth/react';
import { 
  Menu, 
  Sun, 
  Moon, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  // Get dynamic page title
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Analytics Dashboard';
      case '/dashboard/upload':
        return 'Upload & Analysis';
      case '/dashboard/history':
        return 'Analysis History';
      default:
        return 'Analytics Platform';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 border-b glass-panel bg-background/80 border-card-border backdrop-blur-md">
      {/* Breadcrumb & mobile burger toggler */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden text-slate-600 dark:text-slate-400 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <span>Apex</span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-500 dark:text-slate-400 capitalize">
              {pathname.split('/')[2] || 'overview'}
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Header utility actions */}
      <div className="flex items-center space-x-3">
        {/* Live AI status indicator */}
        <div className="hidden sm:flex items-center px-3 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-full animate-pulse">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Engine Online
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-card-border text-slate-600 dark:text-slate-400 active:scale-95 transition-all duration-150"
          title="Toggle Light/Dark Theme"
        >
          <div className="relative w-5 h-5">
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-indigo-600 transition-all duration-300 rotate-0 scale-100" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 transition-all duration-300 rotate-180 scale-100" />
            )}
          </div>
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center pl-2 border-l border-card-border">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-violet-500/10"
            />
          ) : (
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600/10 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
