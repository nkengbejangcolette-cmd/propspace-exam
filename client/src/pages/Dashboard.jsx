import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Home, DollarSign, Building2 } from 'lucide-react';
import api from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';
import PropertyForm from '../components/PropertyForm.jsx';
import { Loading, Empty, ErrorState } from '../components/States.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [editing, setEditing] = useState(null); // property | 'new' | null
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    api
      .get('/properties/mine')
      .then(({ data }) => {
        setItems(data.items);
        setStatus(data.items.length ? 'done' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing && editing._id) {
        const { data } = await api.put(`/properties/${editing._id}`, payload);
        setItems((list) => list.map((p) => (p._id === data.property._id ? data.property : p)));
        toast.success('Listing updated');
      } else {
        const { data } = await api.post('/properties', payload);
        setItems((list) => [data.property, ...list]);
        setStatus('done');
        toast.success('Listing published');
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (property) => {
    try {
      await api.delete(`/properties/${property._id}`);
      setItems((list) => {
        const next = list.filter((p) => p._id !== property._id);
        if (next.length === 0) setStatus('empty');
        return next;
      });
      toast.success('Listing removed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmDelete(null);
    }
  };

  const totalValue = items.reduce((sum, p) => sum + p.price, 0);
  const stats = [
    { icon: Home, label: 'Listings', value: items.length },
    { icon: Building2, label: 'For sale', value: items.filter((p) => p.purpose === 'Sale').length },
    {
      icon: DollarSign,
      label: 'Portfolio value',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink-900">My listings</h1>
          <p className="mt-1 text-coal/60">Create, edit, and remove the properties you own.</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary">
          <Plus className="h-4 w-4" /> List property
        </button>
      </div>

      {status === 'done' && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-600">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm text-coal/60">{label}</p>
                <p className="font-display text-2xl font-semibold text-ink-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        {status === 'loading' && <Loading label="Loading your listings…" />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {status === 'empty' && (
          <Empty
            title="No listings yet"
            message="Publish your first property to start building your portfolio."
            action={
              <button onClick={() => setEditing('new')} className="btn-primary mt-2">
                <Plus className="h-4 w-4" /> List your first property
              </button>
            }
          />
        )}
        {status === 'done' && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <PropertyCard
                key={p._id}
                property={p}
                owned
                onEdit={setEditing}
                onDelete={setConfirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      {editing && (
        <PropertyForm
          initial={editing === 'new' ? null : editing}
          onSubmit={handleSubmit}
          onClose={() => setEditing(null)}
          submitting={submitting}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-coal/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-line bg-canvas p-6 shadow-soft animate-fade-up">
            <h3 className="font-display text-xl font-semibold text-ink-900">Delete this listing?</h3>
            <p className="mt-2 text-coal/60">
              “{confirmDelete.title}” will be permanently removed. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost py-2.5">Cancel</button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700"
              >
                Delete listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
