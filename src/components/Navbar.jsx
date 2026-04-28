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
  Home,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Jobs', to: '/jobs', icon: Briefcase },
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Services', to: '/services', icon: Headphones },
  { label: 'Resources', to: '/resources', icon: FileText },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/20 transition-all">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              JobSearch
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                {label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={toggleDark} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--color-text-secondary)] font-medium">{user.name}</span>
                <button onClick={handleLogout} className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Register
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsEmployerDropdownOpen(!isEmployerDropdownOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white"
                  >
                    <Users className="w-4 h-4" />
                    For Employers
                    <ChevronDown className={`w-4 h-4 transition-transform ${isEmployerDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isEmployerDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 w-56 bg-gray-900 border border-white/10 rounded-2xl p-2 shadow-2xl"
                      >
                         <Link to="/register?role=recruiter" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                            <Building2 className="w-4 h-4" /> Post a Job
                         </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={toggleDark} className="text-gray-400">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900 border-b border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-gray-300 hover:text-white text-lg font-medium">
                  <Icon className="w-5 h-5" /> {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
