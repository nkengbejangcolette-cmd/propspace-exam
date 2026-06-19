import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, BedDouble, Bath, ArrowLeft, Mail, Phone, Pencil } from 'lucide-react';
import api from '../api/client.js';
import { Loading, ErrorState } from '../components/States.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const formatPrice = (price, purpose) => {
  const v = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  return purpose === 'Rent' ? `${v}/mo` : v;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('loading');

  const load = () => {
    setStatus('loading');
    api
      .get(`/properties/${id}`)
      .then(({ data }) => {
        setProperty(data.property);
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, [id]);

  if (status === 'loading') return <Loading label="Loading property…" />;
  if (status === 'error') return <div className="mx-auto max-w-3xl px-5 py-16"><ErrorState onRetry={load} /></div>;

  const isOwner = user && property.owner?._id === user._id;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1 text-sm font-semibold text-ink-600 hover:text-ink-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-3xl border border-line shadow-card">
            <img src={property.images[active]} alt={property.title} className="aspect-[16/11] w-full object-cover" />
          </div>
          {property.images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                    active === i ? 'border-ink-500' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="chip">{property.purpose === 'Rent' ? 'For rent' : 'For sale'}</span>
            <span className="chip bg-amber-400 text-ink-900">{property.propertyType}</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-coal/60">
            <MapPin className="h-4 w-4" /> {property.city}, {property.country}
          </p>

          <p className="mt-4 font-display text-3xl font-extrabold text-amber-600">
            {formatPrice(property.price, property.purpose)}
          </p>

          <div className="mt-5 flex gap-6 rounded-2xl border border-line bg-white p-4">
            <span className="flex items-center gap-2 text-coal/70">
              <BedDouble className="h-5 w-5 text-ink-500" /> {property.bedrooms} bedrooms
            </span>
            <span className="flex items-center gap-2 text-coal/70">
              <Bath className="h-5 w-5 text-ink-500" /> {property.bathrooms} bathrooms
            </span>
          </div>

          <div className="mt-5">
            <h2 className="font-display text-lg font-semibold text-ink-800">About this home</h2>
            <p className="mt-2 whitespace-pre-line text-coal/70">{property.description}</p>
          </div>

          {/* Owner / contact */}
          <div className="mt-6 rounded-2xl border border-line bg-ink-100/40 p-4">
            <p className="text-sm font-semibold text-ink-800">Listed by</p>
            <div className="mt-2 flex items-center gap-3">
              {property.owner?.avatar ? (
                <img src={property.owner.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white">
                  {property.owner?.username?.[0]?.toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-semibold text-ink-900">{property.owner?.username}</p>
                {property.owner?.email && (
                  <p className="flex items-center gap-1 text-sm text-coal/60">
                    <Mail className="h-3.5 w-3.5" /> {property.owner.email}
                  </p>
                )}
                {property.owner?.phone && (
                  <p className="flex items-center gap-1 text-sm text-coal/60">
                    <Phone className="h-3.5 w-3.5" /> {property.owner.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isOwner && (
            <Link to="/dashboard" className="btn-ghost mt-4 w-full">
              <Pencil className="h-4 w-4" /> Manage in dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
