import { useState } from 'react';
import toast from 'react-hot-toast';
import { UserRound, KeyRound } from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from '../components/States.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({
    username: user.username,
    phone: user.phone || '',
    avatar: user.avatar || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/profile', profile);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (!pw.currentPassword || !pw.newPassword) {
      toast.error('Fill in both password fields');
      return;
    }
    if (pw.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (pw.newPassword !== pw.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/users/password', {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-4xl font-semibold text-ink-900">Account settings</h1>
      <p className="mt-1 text-coal/60">Manage your profile and security.</p>

      {/* Profile */}
      <section className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-800">
          <UserRound className="h-5 w-5 text-ink-500" /> Profile
        </h2>

        <div className="mt-5 flex items-center gap-4">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-100 text-2xl font-semibold text-ink-700">
              {profile.username[0]?.toUpperCase()}
            </span>
          )}
          <div className="text-sm text-coal/60">
            <p className="font-semibold text-ink-900">{user.email}</p>
            <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Username</label>
            <input className="field" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="field" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+237 …" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Avatar URL</label>
            <input className="field" value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} placeholder="https://…" />
          </div>
        </div>

        <button onClick={saveProfile} disabled={savingProfile} className="btn-primary mt-5">
          {savingProfile && <Spinner className="h-4 w-4" />} Save profile
        </button>
      </section>

      {/* Password */}
      <section className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-800">
          <KeyRound className="h-5 w-5 text-ink-500" /> Change password
        </h2>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="label">Current password</label>
            <input type="password" className="field" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">New password</label>
              <input type="password" className="field" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input type="password" className="field" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            </div>
          </div>
        </div>

        <button onClick={savePassword} disabled={savingPw} className="btn-primary mt-5">
          {savingPw && <Spinner className="h-4 w-4" />} Update password
        </button>
      </section>
    </div>
  );
}
