import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from '../components/States.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!form.username || !form.email || !form.password) return 'All fields are required';
    if (form.username.length < 3) return 'Username must be at least 3 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return null;
  };

  const submit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Account created — welcome to PropSpace!');
      navigate('/properties', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="rounded-3xl border border-line bg-white p-8 shadow-card animate-fade-up">
        <div className="mb-6 text-center">
          <img src="/mark.svg" alt="" className="mx-auto h-12 w-12" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">Create your account</h1>
          <p className="mt-1 text-coal/60">Start listing and managing properties.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Username</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
              <input className="field pl-9" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="janedoe" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
              <input type="email" className="field pl-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
              <input type="password" className="field pl-9" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
            </div>
          </div>
          <div>
            <label className="label">Confirm password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
              <input type="password" className="field pl-9" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Re-enter password" />
            </div>
          </div>
          <button onClick={submit} disabled={submitting} className="btn-primary w-full">
            {submitting && <Spinner className="h-4 w-4" />} Create account
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-coal/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink-600 hover:text-ink-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
