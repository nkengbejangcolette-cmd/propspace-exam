import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src="/mark.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-xl font-extrabold tracking-tight text-white">PropSpace</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/55">
            Find your luxury dream home. List your property, manage your portfolio, and reach
            people looking for their next place.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-white/55">
            <li><Link to="/properties" className="hover:text-amber-400">All listings</Link></li>
            <li><Link to="/register" className="hover:text-amber-400">Create account</Link></li>
            <li><Link to="/login" className="hover:text-amber-400">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm text-white/55">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/40">
        © {new Date().getFullYear()} PropSpace. Built for the practical project.
      </div>
    </footer>
  );
}
