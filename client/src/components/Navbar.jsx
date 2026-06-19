import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, LogOut, UserRound, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `px-4 py-2 rounded-pill text-sm font-semibold transition ${
    isActive ? 'bg-ink-100 text-ink-700' : 'text-coal/70 hover:text-ink-700'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2">
          <img src="/mark.svg" alt="" className="h-9 w-9" />
          <span className="font-display text-2xl font-extrabold tracking-tight text-ink-900">PropSpace</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/properties" className={linkClass}>
            Listings
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              My Listings
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to="/properties/new" className="btn-primary py-2">
                <Plus className="h-4 w-4" /> List property
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-pill border border-line bg-white px-3 py-2 text-sm font-semibold">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-100 text-ink-700">
                      {user.username[0]?.toUpperCase()}
                    </span>
                  )}
                  {user.username}
                </button>
                <div className="invisible absolute right-0 mt-2 w-48 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
                  <Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-ink-100">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-ink-100">
                    <UserRound className="h-4 w-4" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-dark py-2">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-xl border border-line p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-canvas px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/properties" className={linkClass} onClick={() => setOpen(false)}>
              Listings
            </NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                  My Listings
                </NavLink>
                <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Profile
                </NavLink>
                <Link to="/properties/new" className="btn-primary mt-2" onClick={() => setOpen(false)}>
                  <Plus className="h-4 w-4" /> List property
                </Link>
                <button onClick={handleLogout} className="btn-ghost mt-1 text-red-600">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link to="/login" className="btn-ghost" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
