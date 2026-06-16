'use client';

import { useEffect, useState } from 'react';
import { useThemeToggle } from '@/components/ui/skiper26';
import { ThemeToggleButton2 } from '@/components/ui/skiper4';

export default function Topbar() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isDark, toggleTheme } = useThemeToggle({
    variant: "circle",
    start: "top-right",
  });



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
        <div className="flex items-center">
          <img src="./logo.svg" alt="logo" className='h-10 w-auto dark:invert cursor-pointer' 
          onClick={() => window.location.href = "/metriica.vercel.app"} />
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-3">
          {mounted && (
            <ThemeToggleButton2 
              isDark={isDark}
              onToggle={toggleTheme}
              className="h-10 w-10 border border-slate-200 dark:border-slate-700/50 cursor-pointer"
            />
          )}
        </div>
      </div>
    </header>
  );
}
