import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useAuthState();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Discover' },
    { to: '/weekly', label: 'Weekly Highlights' },
    ...(user ? [
      { to: '/my-recipes', label: 'My Recipes' },
      { to: '/favorites', label: 'Favorites' },
      { to: '/add-recipe', label: '+ Add Recipe' },
    ] : []),
  ];

  return (
    <header className="bg-[#a54d2a] shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white font-serif text-xl font-bold tracking-wide">
          🍴 Recipe Organizer
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-white/20 text-white underline underline-offset-4'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { signOut(auth); navigate('/'); }}
              className="ml-2 px-4 py-2 bg-white text-[#a54d2a] rounded-md text-sm font-semibold hover:bg-[#ffeaad] transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link to="/login" className="px-4 py-2 text-white/90 hover:text-white text-sm font-medium">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-white text-[#a54d2a] rounded-md text-sm font-semibold hover:bg-[#ffeaad] transition-colors">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#8a3e20] px-4 pb-4 flex flex-col gap-2">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-white py-2 border-b border-white/10 font-medium"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { signOut(auth); navigate('/'); setMenuOpen(false); }}
              className="text-left text-white py-2 font-medium"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-white py-2 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-white py-2 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
