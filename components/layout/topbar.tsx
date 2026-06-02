'use client';

import { BarChart2, Sun, Moon, FlaskConical } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface TopbarProps {
  onLoadSampleData?: () => void;
}

export default function Topbar({ onLoadSampleData }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDark = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <header
      id="topbar"
      className="
        sticky top-0 z-50 w-full
        bg-white/80 dark:bg-slate-950/80 backdrop-blur-md
        border-b border-slate-200 dark:border-slate-800/60
        shadow-lg shadow-black/5 dark:shadow-black/20
        transition-colors duration-300
      "
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 h-16">
        {/* ── Logo ── */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex items-center justify-center
              w-9 h-9 rounded-xl
              bg-gradient-to-br from-violet-500 to-indigo-600
              shadow-md shadow-violet-500/30
            "
          >
            <BarChart2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-500 bg-clip-text text-transparent tracking-tight">
            Metrica
          </h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
            MVP
          </span>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-3">
          <button
            id="load-sample-data-btn"
            onClick={onLoadSampleData}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl text-sm font-medium
              bg-violet-600 hover:bg-violet-500
              text-white
              transition-all duration-200
              shadow-md shadow-violet-600/30
              hover:shadow-violet-500/40
              active:scale-95
            "
          >
            <FlaskConical className="w-4 h-4" />
            <span className="hidden sm:inline">Load Sample Data</span>
            <span className="sm:hidden">Sample</span>
          </button>

          <button
            id="dark-mode-toggle-btn"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="
              flex items-center justify-center
              w-10 h-10 rounded-xl
              bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700
              text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200
              border border-slate-200 dark:border-slate-700/50
              transition-all duration-200
              active:scale-95
            "
          >
            {mounted && isDark ? (
              <Sun className="w-4 h-4" />
            ) : mounted ? (
              <Moon className="w-4 h-4" />
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
