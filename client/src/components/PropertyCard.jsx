import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Pencil, Trash2, ArrowUpRight } from 'lucide-react';

const formatPrice = (price, purpose) => {
  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  return purpose === 'Rent' ? `${value}/mo` : value;
};

export default function PropertyCard({ property, owned = false, onEdit, onDelete }) {
  const cover = property.images?.[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative">
        <Link to={`/properties/${property._id}`} className="block aspect-[4/3] overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={property.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-ink-100 text-ink-400">No image</div>
          )}
        </Link>
        <span className="absolute left-3 top-3 chip bg-white/90 backdrop-blur">
          {property.purpose === 'Rent' ? 'For rent' : 'For sale'}
        </span>
        <span className="absolute right-3 top-3 rounded-pill bg-amber-400 px-3 py-1 text-sm font-bold text-ink-900 shadow-card">
          {formatPrice(property.price, property.purpose)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/properties/${property._id}`}>
            <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink-900 hover:text-amber-600">
              {property.title}
            </h3>
          </Link>
          <Link
            to={`/properties/${property._id}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-700 transition hover:border-ink-800 hover:bg-ink-900 hover:text-white"
            aria-label={`View ${property.title}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm text-coal/55">
          <MapPin className="h-4 w-4" /> {property.city}, {property.country}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-coal/60">{property.description}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-sm text-coal/70">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-amber-500" /> {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-amber-500" /> {property.bathrooms} ba
          </span>
          <span className="ml-auto chip">{property.propertyType}</span>
        </div>

        {owned && (
          <div className="mt-4 flex gap-2">
            <button onClick={() => onEdit?.(property)} className="btn-ghost flex-1 py-2 text-sm">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={() => onDelete?.(property)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-pill border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
