// src/components/ProductCard.jsx
export default function ProductCard({ name, pieces, color }) {
  // Generate a shoe-like SVG placeholder
  return (
    <div className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      {/* Product image placeholder */}
      <div
        className="w-full h-24 rounded-xl flex items-center justify-center relative overflow-hidden"
        style={{ background: `${color}22` }}
      >
        <svg viewBox="0 0 80 50" className="w-20 h-16" fill="none">
          {/* Simple sneaker silhouette */}
          <ellipse cx="40" cy="40" rx="35" ry="6" fill={color} opacity="0.3" />
          <path
            d="M10 35 Q15 18 28 16 L52 14 Q64 13 68 22 Q72 30 65 35 Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M10 35 Q15 38 65 35 Q67 37 10 37 Z"
            fill={color}
          />
          <path
            d="M30 16 Q34 10 40 12 Q46 10 50 14"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <circle cx="55" cy="22" r="3" fill="white" opacity="0.5" />
          <circle cx="48" cy="20" r="2" fill="white" opacity="0.5" />
        </svg>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-xl"
          style={{ background: `${color}15` }}
        />
      </div>

      {/* Info */}
      <div>
        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{pieces.toLocaleString()} Pcs</p>
      </div>

      {/* Mini bar */}
      <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min((pieces / 800) * 100, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
