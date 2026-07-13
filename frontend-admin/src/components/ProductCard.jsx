// src/components/ProductCard.jsx
export default function ProductCard({ name, pieces, color }) {
  return (
    <div className="flex-shrink-0 w-36 bg-white rounded-none border border-neutral-200 p-3.5 flex flex-col gap-3 hover:border-black transition-colors cursor-pointer group">
      {/* Product placeholder */}
      <div className="w-full h-20 rounded-none bg-neutral-50 border border-neutral-100 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 80 50" className="w-16 h-12 stroke-neutral-700" fill="none">
          <ellipse cx="40" cy="40" rx="30" ry="4" stroke="#d4d4d4" strokeWidth="1" />
          <path
            d="M15 35 Q18 20 28 18 L52 16 Q62 15 65 24 Q68 30 62 35 Z"
            fill="#f5f5f5"
            stroke="#171717"
            strokeWidth="1.5"
          />
          <path d="M15 35 Q18 37 62 35" stroke="#171717" strokeWidth="1.5" />
          <path d="M30 18 Q35 12 40 14 Q45 12 50 16" stroke="#171717" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-black truncate">{name}</p>
        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">{pieces.toLocaleString()} units</p>
      </div>

      {/* Mini bar */}
      <div className="h-1 rounded-none bg-neutral-100 overflow-hidden">
        <div
          className="h-full rounded-none bg-black transition-all duration-500"
          style={{ width: `${Math.min((pieces / 800) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
