// src/components/TopBar.jsx
import { ChevronDown } from 'lucide-react';

export default function TopBar({ pageTitle }) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: page title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
      </div>

      {/* Right: user */}
      <div className="flex items-center gap-3">
        {/* User */}
        <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-all duration-150 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500 leading-tight">admin@petstore.com</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
