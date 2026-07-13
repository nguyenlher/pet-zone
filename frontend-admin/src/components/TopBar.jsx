// src/components/TopBar.jsx
import { ChevronDown, ShieldCheck } from 'lucide-react';

export default function TopBar({ pageTitle }) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-30 select-none">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-sm font-semibold text-neutral-800">
          {pageTitle}
        </h1>
      </div>

      {/* Right: User Profile Chip */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 bg-white transition-colors duration-150 cursor-pointer shadow-sm">
          <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-semibold">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-neutral-900 leading-none">
              Admin User
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-none">
              admin@petzone.com
            </p>
          </div>
          <ChevronDown size={14} className="text-neutral-400 ml-1" />
        </button>
      </div>
    </header>
  );
}
