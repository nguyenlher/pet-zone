// src/components/TableControls.jsx
import { useState } from 'react';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react';

/**
 * Filter dropdown popover on table column header
 */
export function ColumnFilter({ label, activeValue, options = [], onChange, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const isFiltered = activeValue && activeValue !== 'ALL';

  return (
    <div className="relative inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <span className="font-semibold">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`p-1 rounded transition-colors cursor-pointer ${
          isFiltered 
            ? 'text-black bg-neutral-200 font-bold' 
            : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
        }`}
        title={`Lọc theo ${label}`}
      >
        <Filter size={11} className={isFiltered ? 'fill-current' : ''} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div 
            className={`absolute top-full mt-1.5 bg-white border border-neutral-200 shadow-xl z-30 min-w-[170px] py-1 text-left font-normal normal-case ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {options.map((opt) => {
              const selected = activeValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selected
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Sort toggle button on table column header
 */
export function ColumnSort({ label, sortField, currentSort = '', onSort, align = 'left' }) {
  const [field, direction] = (currentSort || '').split(',');
  const isActive = field === sortField;

  const handleToggle = () => {
    if (!isActive) {
      onSort(`${sortField},desc`);
    } else if (direction === 'desc') {
      onSort(`${sortField},asc`);
    } else {
      onSort(`${sortField},desc`);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 cursor-pointer select-none hover:text-black transition-colors ${
        align === 'right' ? 'justify-end' : ''
      }`}
      title={`Nhấn để sắp xếp theo ${label}`}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-neutral-400">
        {isActive ? (
          direction === 'desc' ? (
            <ArrowDown size={12} className="text-black stroke-[2.5]" />
          ) : (
            <ArrowUp size={12} className="text-black stroke-[2.5]" />
          )
        ) : (
          <ArrowUpDown size={11} />
        )}
      </span>
    </div>
  );
}

/**
 * Compact search input placed on Card Header
 */
export function CardHeaderSearch({ value, onChange, placeholder = 'Tìm kiếm...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={13} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-48 sm:w-64 pl-8 pr-7 py-1.5 border border-neutral-200 rounded-none text-xs placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors bg-white"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
