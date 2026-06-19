import { Search, SlidersHorizontal, X } from 'lucide-react';

const TYPES = ['Apartment', 'House', 'Studio'];
const PURPOSES = ['Rent', 'Sale'];

export default function FilterSidebar({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="rounded-3xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-800">
          <SlidersHorizontal className="h-5 w-5 text-ink-500" /> Filters
        </h3>
        <button onClick={onReset} className="flex items-center gap-1 text-sm text-coal/50 hover:text-red-600">
          <X className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
            <input
              className="field pl-9"
              placeholder="Title, city, keyword…"
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">City</label>
          <input
            className="field"
            placeholder="e.g. Buea"
            value={filters.city}
            onChange={(e) => set('city', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Purpose</label>
          <div className="flex gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p}
                onClick={() => set('purpose', filters.purpose === p ? '' : p)}
                className={`flex-1 rounded-pill px-3 py-2 text-sm font-semibold transition ${
                  filters.purpose === p ? 'bg-ink-600 text-white' : 'bg-ink-100 text-ink-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Property type</label>
          <select
            className="field"
            value={filters.propertyType}
            onChange={(e) => set('propertyType', e.target.value)}
          >
            <option value="">Any type</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Price range (USD)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              className="field"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => set('minPrice', e.target.value)}
            />
            <span className="text-coal/40">–</span>
            <input
              type="number"
              min="0"
              className="field"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => set('maxPrice', e.target.value)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
