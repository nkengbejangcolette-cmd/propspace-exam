import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import PropertyForm from '../components/PropertyForm.jsx';

export default function NewProperty() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/properties', payload);
      toast.success('Listing published');
      navigate(`/properties/${data.property._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PropertyForm
      onSubmit={handleSubmit}
      onClose={() => navigate('/dashboard')}
      submitting={submitting}
    />
  );
}
