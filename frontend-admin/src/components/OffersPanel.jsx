// src/components/OffersPanel.jsx
import { Tag } from 'lucide-react';
import { currentOffers } from '../data/mockData';

export default function OffersPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Current Offers</h2>
        <button className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-150 cursor-pointer">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {currentOffers.map((offer) => (
          <div key={offer.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Tag size={12} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{offer.name}</p>
                <p className="text-xs text-gray-400">{offer.expiry}</p>
              </div>
              <span className="text-xs font-semibold text-gray-600">{offer.progress}%</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden ml-8">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${offer.progress}%`,
                  background: offer.progress > 70
                    ? '#10B981'
                    : offer.progress > 40
                    ? '#F59E0B'
                    : '#6366F1',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
