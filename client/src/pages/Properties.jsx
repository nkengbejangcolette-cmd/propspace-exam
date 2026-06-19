import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import { Loading, Empty, ErrorState } from '../components/States.jsx';

const blankFilters = { search: '', city: '', purpose: '', propertyType: '', minPrice: '', maxPrice: '' };

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...blankFilters,
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
  });
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  const fetchProperties = useCallback(() => {
    setStatus('loading');
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );
    api
      .get('/properties', { params })
      .then(({ data }) => {
        setItems(data.items);
        setStatus(data.items.length ? 'done' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, [filters]);

  // Debounce so typing in the filter inputs doesn't spam the API.
  useEffect(() => {
    const id = setTimeout(fetchProperties, 300);
    return () => clearTimeout(id);
  }, [fetchProperties]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-ink-900">Explore listings</h1>
        <p className="mt-2 text-coal/60">
          Find your next eco-friendly home. Filter by city, price, and type.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(blankFilters)}
          />
        </div>

        <div>
          {status === 'loading' && <Loading />}
          {status === 'error' && <ErrorState onRetry={fetchProperties} />}
          {status === 'empty' && (
            <Empty
              title="No matching homes"
              message="Try widening your filters or clearing the search to see more listings."
            />
          )}
          {status === 'done' && (
            <>
              <p className="mb-4 text-sm text-coal/60">{items.length} home{items.length !== 1 && 's'} found</p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
