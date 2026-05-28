'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  Sparkles, 
  BarChart3, 
  UploadCloud, 
  History, 
  LogOut, 
  X,
  User as UserIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      label: 'Analytics Dashboard',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      label: 'Upload Report/CSV',
      href: '/dashboard/upload',
      icon: UploadCloud,
    },
    {
      label: 'Analysis History',
      href: '/dashboard/history',
      icon: History,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 h-full transition-transform duration-300 ease-in-out border-r glass-panel bg-sidebar-bg/95 border-card-border lg:translate-x-0 lg:static lg:z-auto lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and close button header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-card-border">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 group-hover:scale-105 transition-all duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-400 dark:from-violet-400 dark:via-indigo-200 dark:to-white">
                Apex Analytics
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 lg:hidden text-slate-500 dark:text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer info */}
        <div className="p-4 border-t border-card-border">
          <div className="flex items-center px-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-card-border/50 mb-3">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500/20"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600/10 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {session?.user?.name || 'User Profile'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {session?.user?.email || 'authenticated'}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 border border-transparent rounded-xl transition duration-150 active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
