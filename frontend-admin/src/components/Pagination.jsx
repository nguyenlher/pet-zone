// src/components/Pagination.jsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage = 0, // 0-indexed
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemName = 'mục',
}) {
  if (totalItems === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 0; i < safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0); // Always first page

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(safeTotalPages - 2, currentPage + 1);

      if (start > 1) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < safeTotalPages - 2) {
        pages.push('ellipsis-end');
      }

      pages.push(safeTotalPages - 1); // Always last page
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="px-5 py-3.5 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-50/60 select-none">
      {/* Left: Summary & Page Size Selector */}
      <div className="flex items-center gap-3 text-xs text-neutral-600">
        <span className="font-mono">
          Hiển thị <span className="font-bold text-neutral-900">{startItem}</span> - <span className="font-bold text-neutral-900">{endItem}</span> trên <span className="font-bold text-neutral-900">{totalItems}</span> {itemName}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-neutral-200 pl-3">
            <span className="text-[11px] text-neutral-400">Số dòng:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                if (onPageChange) onPageChange(0);
              }}
              className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs text-neutral-700 focus:outline-none focus:border-neutral-900 cursor-pointer font-mono"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          title="Trang đầu"
          className="p-1.5 border border-neutral-200 rounded text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed bg-white transition-colors cursor-pointer"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Prev Page */}
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          title="Trang trước"
          className="p-1.5 border border-neutral-200 rounded text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed bg-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) => {
            if (p === 'ellipsis-start' || p === 'ellipsis-end') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-neutral-400">
                  ...
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`min-w-[28px] h-7 px-2 flex items-center justify-center text-xs font-mono rounded transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-neutral-900'
                }`}
              >
                {p + 1}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(Math.min(safeTotalPages - 1, currentPage + 1))}
          disabled={currentPage >= safeTotalPages - 1}
          title="Trang sau"
          className="p-1.5 border border-neutral-200 rounded text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed bg-white transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(safeTotalPages - 1)}
          disabled={currentPage >= safeTotalPages - 1}
          title="Trang cuối"
          className="p-1.5 border border-neutral-200 rounded text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed bg-white transition-colors cursor-pointer"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
