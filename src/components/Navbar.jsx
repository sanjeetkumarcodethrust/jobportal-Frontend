import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
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
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GUEST_NAV_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Jobs', to: '/jobs', icon: Briefcase },
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Services', to: '/services', icon: Headphones },
  { label: 'Resources', to: '/resources', icon: FileText },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const employerDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        employerDropdownRef.current &&
        !employerDropdownRef.current.contains(e.target)
      ) {
        setIsEmployerDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Dark mode init
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

  const [unreadCount, setUnreadCount] = useState(0);

  // Check for genuine unread messages
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // If currently on messages tab, mark as read immediately
    if (
      location.pathname === '/dashboard' &&
      location.search.includes('tab=messages')
    ) {
      setUnreadCount(0);
      localStorage.setItem(
        `messages_last_read_${user._id || user.email}`,
        Date.now().toString()
      );
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/applications/my');
        const apps = Array.isArray(res.data) ? res.data : [];
        const lastRead = parseInt(
          localStorage.getItem(`messages_last_read_${user._id || user.email}`) || '0',
          10
        );
        const dismissedKey = `dismissed_message_ids_${user._id || user.email}`;
        const dismissedIds = JSON.parse(
          localStorage.getItem(dismissedKey) || '[]'
        );

        let unread = 0;
        if (user.role === 'recruiter') {
          // For recruiters: count applications submitted to their jobs after lastRead
          apps.forEach((app, idx) => {
            const msgId = `recruiter-app-${app._id || idx}`;
            if (dismissedIds.includes(msgId)) return;
            const time = new Date(app.createdAt || 0).getTime();
            if (lastRead > 0 && time > lastRead) {
              unread++;
            }
          });
        } else {
          // For candidates: count shortlisted status updates after lastRead
          apps.forEach((app, idx) => {
            if (app.status === 'shortlisted') {
              const msgId = `app-shortlisted-${app._id || idx}`;
              if (dismissedIds.includes(msgId)) return;
              const time = new Date(app.updatedAt || app.createdAt || 0).getTime();
              const isRecent = Date.now() - time < 7 * 24 * 60 * 60 * 1000;
              if (isRecent && (lastRead === 0 || time > lastRead)) {
                unread++;
              }
            }
          });
        }

        setUnreadCount(unread);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    const handleMessagesRead = () => {
      setUnreadCount(0);
    };
    window.addEventListener('messages_read', handleMessagesRead);
    return () => {
      window.removeEventListener('messages_read', handleMessagesRead);
    };
  }, [user, location.pathname, location.search]);

  const isRecruiter = user?.role === 'recruiter';

  // Navigation links for logged-in users (shows Applied Jobs & Messages only when logged in)
  const loggedInNavLinks = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Browse Jobs', to: '/jobs', icon: Briefcase },
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    {
      label: isRecruiter ? 'Candidates' : 'Applied Jobs',
      to: isRecruiter ? '/dashboard?tab=applicants' : '/dashboard?tab=applied',
      icon: isRecruiter ? Users : Briefcase,
      badge: isRecruiter ? null : 'Active',
    },
    {
      label: 'Messages',
      to: '/dashboard?tab=messages',
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      onClick: () => {
        setUnreadCount(0);
        if (user) {
          localStorage.setItem(
            `messages_last_read_${user._id || user.email}`,
            Date.now().toString()
          );
        }
      },
    },
  ];

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
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img
                src="/favicon.svg"
                alt="JobSearch Logo"
                className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all duration-300"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              JobSearch
            </span>
          </Link>

          {/* Desktop Nav: Shows Applied Jobs & Messages ONLY WHEN LOGGED IN */}
          <div className="hidden lg:flex items-center gap-1">
            {user
              ? loggedInNavLinks.map(({ label, to, badge, onClick }) => {
                  const isActive =
                    to === '/'
                      ? location.pathname === '/'
                      : to.includes('?')
                      ? location.pathname + location.search === to
                      : location.pathname.startsWith(to);

                  return (
                    <Link
                      key={label}
                      to={to}
                      onClick={onClick}
                      className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all relative group flex items-center gap-1.5 ${
                        isActive
                          ? 'text-purple-500 font-bold bg-purple-500/10'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                      }`}
                    >
                      {label}
                      {badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-400">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })
              : GUEST_NAV_LINKS.map(({ label, to }) => (
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
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-purple-500/40 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Direct Messages Quick Link Button */}
                <Link
                  to="/dashboard?tab=messages"
                  onClick={() => {
                    setUnreadCount(0);
                    if (user) {
                      localStorage.setItem(
                        `messages_last_read_${user._id || user.email}`,
                        Date.now().toString()
                      );
                    }
                  }}
                  title="View Messages & Notifications"
                  className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-purple-500 hover:border-purple-500/50 transition-colors relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
                  )}
                </Link>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-purple-500/40 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-1">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)] capitalize">
                        {user.role || 'Candidate'}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform duration-200 ${
                        isUserDropdownOpen ? 'rotate-180 text-purple-500' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-64 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-2 z-50 backdrop-blur-2xl"
                      >
                        {/* Dropdown Header */}
                        <div className="p-3 border-b border-[var(--color-border)] mb-1">
                          <p className="text-xs text-[var(--color-text-muted)] font-medium">
                            Signed in as
                          </p>
                          <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                            {user.email}
                          </p>
                          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20 uppercase tracking-wider">
                            {user.role || 'Candidate'}
                          </span>
                        </div>

                        {/* Dropdown Links */}
                        <div className="space-y-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 text-xs font-semibold text-[var(--color-text-primary)] hover:text-purple-500 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-500" />
                            Dashboard Overview
                          </Link>

                          <Link
                            to={
                              isRecruiter
                                ? '/dashboard?tab=applicants'
                                : '/dashboard?tab=applied'
                            }
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 text-xs font-semibold text-[var(--color-text-primary)] hover:text-purple-500 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            {isRecruiter ? 'Applicant Pipeline' : 'Applied Jobs'}
                          </Link>

                          <Link
                            to="/dashboard?tab=messages"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setUnreadCount(0);
                              if (user) {
                                localStorage.setItem(
                                  `messages_last_read_${user._id || user.email}`,
                                  Date.now().toString()
                                );
                              }
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 text-xs font-semibold text-[var(--color-text-primary)] hover:text-purple-500 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 text-pink-500" />
                            Messages & Alerts
                          </Link>

                          <Link
                            to="/dashboard?tab=saved"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 text-xs font-semibold text-[var(--color-text-primary)] hover:text-purple-500 transition-colors"
                          >
                            <Bookmark className="w-4 h-4 text-amber-500" />
                            Saved Jobs
                          </Link>

                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 text-xs font-semibold text-[var(--color-text-primary)] hover:text-purple-500 transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-indigo-500" />
                            My Profile Settings
                          </Link>
                        </div>

                        <div className="border-t border-[var(--color-border)] mt-2 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-xs font-semibold text-red-500 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Register
                </Link>
                <div className="relative" ref={employerDropdownRef}>
                  <button
                    onClick={() =>
                      setIsEmployerDropdownOpen(!isEmployerDropdownOpen)
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    For Employers
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isEmployerDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isEmployerDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 w-56 bg-gray-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
                      >
                        <Link
                          to="/register?role=recruiter"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-purple-400" /> Post a Job
                        </Link>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-blue-400" /> Employer Sign In
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={toggleDark} className="text-[var(--color-text-secondary)] p-2">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--color-text-primary)] p-2 cursor-pointer"
            >
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
            className="lg:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-2xl"
          >
            <div className="px-4 py-6 space-y-3">
              {user ? (
                <>
                  <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                      {user.role || 'Candidate'}
                    </span>
                  </div>

                  {loggedInNavLinks.map(({ label, to, icon: Icon, onClick }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (onClick) onClick();
                      }}
                      className="flex items-center gap-4 text-[var(--color-text-primary)] hover:text-purple-500 text-base font-semibold py-2 px-3 rounded-xl hover:bg-purple-500/5 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-purple-500" /> {label}
                    </Link>
                  ))}

                  <Link
                    to="/dashboard?tab=saved"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-[var(--color-text-primary)] hover:text-purple-500 text-base font-semibold py-2 px-3 rounded-xl hover:bg-purple-500/5 transition-colors"
                  >
                    <Bookmark className="w-5 h-5 text-amber-500" /> Saved Jobs
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-[var(--color-text-primary)] hover:text-purple-500 text-base font-semibold py-2 px-3 rounded-xl hover:bg-purple-500/5 transition-colors"
                  >
                    <UserIcon className="w-5 h-5 text-indigo-500" /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-4 text-red-500 text-base font-semibold py-2 px-3 rounded-xl hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  {GUEST_NAV_LINKS.map(({ label, to, icon: Icon }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-[var(--color-text-primary)] hover:text-purple-500 text-base font-medium py-2 px-3 rounded-xl hover:bg-purple-500/5 transition-colors"
                    >
                      <Icon className="w-5 h-5" /> {label}
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-bold text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
                    >
                      Register
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
