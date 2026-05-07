// src/pages/PlaceholderPage.jsx
import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
        <Construction size={28} className="text-amber-600" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">This section is coming soon</p>
      </div>
    </div>
  );
}
