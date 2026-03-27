import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useState,useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user } = useAuthState();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const links = [
    { to: '/', label: t.discover },
    { to: '/weekly', label: t.weekly },
    ...(user ? [
      { to: '/my-recipes', label: t.myRecipes },
      { to: '/favorites', label: t.favorites },
      { to: '/add-recipe', label: t.addRecipe },
    ] : []),
  ];

  return (
    <header className="bg-[#a54d2a] shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white font-serif text-xl font-bold tracking-wide">
          🍴 {t.appName}
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
          <button onClick={toggleTheme} className="mx-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="mx-2 px-3 py-1.5 rounded-full border-2 border-white/60 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {user ? (
            <button
              onClick={() => { signOut(auth); navigate('/'); }}
              className="px-4 py-2 bg-white text-[#a54d2a] rounded-md text-sm font-semibold hover:bg-[#ffeaad] transition-colors"
            >
              {t.signOut}
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-white/90 hover:text-white text-sm font-medium">{t.login}</Link>
              <Link to="/register" className="px-4 py-2 bg-white text-[#a54d2a] rounded-md text-sm font-semibold hover:bg-[#ffeaad] transition-colors">{t.register}</Link>
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
          <button onClick={toggleTheme} className="text-white py-2 border-b border-white/10 text-left flex justify-between items-center">
             <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
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
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="text-left text-white py-2 font-medium border-b border-white/10"
          >
            {language === 'ar' ? '🌐 English' : '🌐 عربي'}
          </button>
          {user ? (
            <button
              onClick={() => { signOut(auth); navigate('/'); setMenuOpen(false); }}
              className="text-left text-white py-2 font-medium"
            >
              {t.signOut}
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-white py-2 font-medium">{t.login}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-white py-2 font-medium">{t.register}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}