import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Menu,
  X,
  Briefcase,
  ChevronDown,
  Moon,
  Sun,
  Building2,
  Users,
  Headphones,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Jobs', to: '/jobs', icon: Briefcase },
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Services', to: '/services', icon: Headphones },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  /* ── Dark mode toggle ─── */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  /* ── Scroll shadow ─── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Close dropdown on outside click ─── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsEmployerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg'
          : 'bg-white dark:bg-slate-900'
      } border-b border-gray-100 dark:border-slate-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ─── */}
          <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900 transition-shadow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400">naukri</span>
            </span>
          </Link>

          {/* ── Desktop Navigation ─── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                id={`nav-link-${label.toLowerCase()}`}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ─── */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              id="dark-mode-toggle"
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  id="nav-dashboard"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    id="nav-logout"
                    className="text-sm font-medium px-4 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  id="nav-login"
                  className="text-sm font-semibold px-5 py-2 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  id="nav-register"
                  className="text-sm font-semibold px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/30 transition-all duration-200"
                >
                  Register
                </Link>

                {/* For Employers Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsEmployerDropdownOpen(!isEmployerDropdownOpen)}
                    id="nav-employer-dropdown"
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <Users className="w-4 h-4" />
                    For Employers
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isEmployerDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isEmployerDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-gray-100 dark:ring-slate-700 overflow-hidden"
                      >
                        <div className="py-2">
                          <Link
                            to="/register?role=recruiter"
                            onClick={() => setIsEmployerDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-indigo-500" />
                            <div>
                              <div className="font-medium">Post a Job</div>
                              <div className="text-xs text-gray-400">Reach millions of candidates</div>
                            </div>
                          </Link>
                          <Link
                            to="/register?role=recruiter"
                            onClick={() => setIsEmployerDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          >
                            <Users className="w-4 h-4 text-indigo-500" />
                            <div>
                              <div className="font-medium">Employer Login</div>
                              <div className="text-xs text-gray-400">Manage your postings</div>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ─── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-all"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}

              <div className="border-t border-gray-100 dark:border-slate-800 my-3" />

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-indigo-400 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
