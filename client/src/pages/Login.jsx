import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from '../components/States.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/properties';

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      toast.error('Enter your email and password');
      return;
    }
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
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
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-coal/60">Log in to manage your listings.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
              <input
                type="email"
                className="field pl-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coal/40" />
              <input
                type="password"
                className="field pl-9"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="••••••••"
              />
            </div>
          </div>
          <button onClick={submit} disabled={submitting} className="btn-primary w-full">
            {submitting && <Spinner className="h-4 w-4" />} Log in
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-coal/60">
          New to PropSpace?{' '}
          <Link to="/register" className="font-semibold text-ink-600 hover:text-ink-700">
            Create an account
          </Link>
        </p>
        <p className="mt-3 rounded-xl bg-ink-100/50 p-3 text-center text-xs text-coal/60">
          Demo login — <strong>demo@propspace.app</strong> / <strong>demo123</strong>
        </p>
      </div>
    </div>
  );
}
