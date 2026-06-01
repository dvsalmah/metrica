'use client';

import { BarChart2, Sun, Moon, FlaskConical } from 'lucide-react';
import { useState } from 'react';

interface TopbarProps {
  onLoadSampleData?: () => void;
}

export default function Topbar({ onLoadSampleData }: TopbarProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <header
      id="topbar"
      className="
        sticky top-0 z-50 w-full
        bg-slate-950/80 backdrop-blur-md
        border-b border-slate-800/60
        shadow-lg shadow-black/20
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
          <span
            className="
              text-xl font-bold tracking-tight
              bg-gradient-to-r from-violet-400 to-indigo-300
              bg-clip-text text-transparent
            "
          >
            FinSnap
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
            MVP
          </span>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-3">
          {/* Load Sample Data */}
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

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-toggle-btn"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="
              flex items-center justify-center
              w-10 h-10 rounded-xl
              bg-slate-800 hover:bg-slate-700
              text-slate-400 hover:text-slate-200
              border border-slate-700/50
              transition-all duration-200
              active:scale-95
            "
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
