import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Spinner } from './States.jsx';

const TYPES = ['Apartment', 'House', 'Studio'];
const PURPOSES = ['Rent', 'Sale'];

const emptyForm = {
  title: '', description: '', price: '', purpose: 'Rent', propertyType: 'Apartment',
  city: '', country: '', bedrooms: 1, bathrooms: 1, images: [''],
};

export default function PropertyForm({ initial, onSubmit, onClose, submitting }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initial,
    images: initial?.images?.length ? initial.images : [''],
  }));
  const [errors, setErrors] = useState({});

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setImage = (idx, value) =>
    setForm((f) => ({ ...f, images: f.images.map((img, i) => (i === idx ? value : img)) }));
  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  // Validate before hitting the network so we never submit broken data.
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.price === '' || Number(form.price) < 0) e.price = 'Enter a valid price';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.country.trim()) e.country = 'Country is required';
    const images = form.images.map((i) => i.trim()).filter(Boolean);
    if (images.length === 0) e.images = 'Add at least one image URL';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      images: form.images.map((i) => i.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-coal/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-line bg-canvas shadow-soft animate-fade-up">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-ink-800">
            {initial?._id ? 'Edit listing' : 'List a new property'}
          </h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-ink-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="label">Title</label>
            <input className="field" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Sunny two-bedroom apartment" />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea rows={4} className="field resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the property, surroundings and what makes it special…" />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Price (USD)</label>
              <input type="number" min="0" className="field" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0" />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label className="label">Purpose</label>
              <select className="field" value={form.purpose} onChange={(e) => set('purpose', e.target.value)}>
                {PURPOSES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Type</label>
              <select className="field" value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Bedrooms</label>
              <input type="number" min="0" className="field" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} />
            </div>
            <div>
              <label className="label">Bathrooms</label>
              <input type="number" min="0" className="field" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">City</label>
              <input className="field" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Buea" />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
            <div>
              <label className="label">Country</label>
              <input className="field" value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Cameroon" />
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>
          </div>

          <div>
            <label className="label">Image URLs</label>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="field" value={img} onChange={(e) => setImage(idx, e.target.value)} placeholder="https://…" />
                  {form.images.length > 1 && (
                    <button onClick={() => removeImage(idx)} className="rounded-2xl border border-red-200 bg-red-50 px-3 text-red-600 hover:bg-red-100" aria-label="Remove image">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addImage} className="mt-2 flex items-center gap-1 text-sm font-semibold text-ink-600 hover:text-ink-700">
              <Plus className="h-4 w-4" /> Add another image
            </button>
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
          <button onClick={onClose} className="btn-ghost py-2.5">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary py-2.5">
            {submitting && <Spinner className="h-4 w-4" />}
            {initial?._id ? 'Save changes' : 'Publish listing'}
          </button>
        </div>
      </div>
    </div>
  );
}
