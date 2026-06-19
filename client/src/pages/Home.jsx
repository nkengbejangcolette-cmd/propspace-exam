import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, Wallet, BadgeCheck, ArrowRight, Star } from 'lucide-react';
import api from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { Loading, ErrorState } from '../components/States.jsx';

const TILES = [
  { icon: MapPin, title: 'Location', text: 'Search by city or neighborhood.' },
  { icon: Building2, title: 'Property Type', text: 'Apartments, houses and studios.' },
  { icon: Wallet, title: 'Budget', text: 'Filter by your price range.' },
  { icon: BadgeCheck, title: 'Verified', text: 'Listings owned by real users.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTile, setActiveTile] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('loading');

  const loadFeatured = () => {
    setStatus('loading');
    api
      .get('/properties', { params: { limit: 4 } })
      .then(({ data }) => {
        setFeatured(data.items);
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(loadFeatured, []);

  const goSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Dark luxury hero */}
      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-900 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
            alt="Modern luxury home at dusk with warm interior lighting"
            className="h-[520px] w-full object-cover opacity-90 sm:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/70 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-7 sm:px-14">
            <h1 className="max-w-2xl font-display text-5xl font-extrabold uppercase leading-[0.98] tracking-tight text-white sm:text-7xl">
              Find your
              <br />
              luxury dream
              <br />
              home.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Browse premium homes for rent and sale, list your own property, and manage your
              whole portfolio from one place.
            </p>
            <div className="mt-7">
              <Link to="/properties" className="btn-primary">
                Search <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Floating search field */}
          <div className="absolute inset-x-0 bottom-6 mx-auto w-[min(92%,640px)]">
            <div className="flex items-center gap-2 rounded-pill border border-white/10 bg-white p-2 shadow-soft">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-coal/40" />
                <input
                  className="w-full rounded-pill border-0 bg-transparent py-2.5 pl-11 pr-3 text-coal placeholder:text-coal/40 focus:outline-none"
                  placeholder="Find your home — try a city or keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goSearch()}
                />
              </div>
              <button onClick={goSearch} className="btn-primary px-7 py-2.5">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Icon tiles */}
      <section className="mx-auto max-w-7xl px-5 py-16 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
          Your search, your way
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-coal/55">
          Narrow down listings by what matters most to you, from location to budget.
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map(({ icon: Icon, title, text }, i) => (
            <button
              key={title}
              onClick={() => setActiveTile(i)}
              className={`tile ${activeTile === i ? 'tile-active' : ''}`}
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line">
                <Icon className="h-5 w-5 text-ink-800" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{title}</h3>
              <p className="mt-1 text-sm text-coal/55">{text}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Dark photo banner */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-900">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury bedroom with a city view at night"
            className="h-[340px] w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
            <span className="chip w-fit bg-amber-400/90 text-ink-900">Limited spotlight</span>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Premium homes, picked for you
            </h2>
            <p className="mt-2 max-w-md text-white/70">
              Discover standout properties from owners across the marketplace, updated as new
              listings go live.
            </p>
            <div className="mt-6">
              <Link to="/properties" className="btn-primary">
                Explore listings <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-7 text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
            Search premium near you
          </h2>
          <p className="mt-2 text-coal/55">A few standout places worth a closer look.</p>
        </div>

        {status === 'loading' && <Loading label="Loading featured homes…" />}
        {status === 'error' && <ErrorState onRetry={loadFeatured} />}
        {status === 'done' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/properties" className="btn-dark">
            View all listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
