import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  Bookmark,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  ArrowRight,
  Trash2,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronRight,
  XCircle,
  AlertCircle,
  FileText,
  Lock,
  X,
  FileCheck,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  const defaultTab = user?.role === 'recruiter' ? 'listings' : 'applied';
  const [activeTab, setActiveTab] = useState(urlTab || defaultTab);
  const [selectedApp, setSelectedApp] = useState(null);

  // Sync tab with URL parameter
  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Clear unread notification status when viewing messages tab
  useEffect(() => {
    if (activeTab === 'messages' && user) {
      localStorage.setItem(
        `messages_last_read_${user._id || user.email}`,
        Date.now().toString()
      );
      window.dispatchEvent(new Event('messages_read'));
    }
  }, [activeTab, user]);

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch applications & saved jobs on mount
  useEffect(() => {
    if (!user) return;

    // Load saved jobs from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      setSavedJobs(saved);
    } catch {
      setSavedJobs([]);
    }

    // Load applications from backend
    const fetchApplications = async () => {
      setLoadingApps(true);
      try {
        const res = await api.get('/applications/my');
        const apps = Array.isArray(res.data) ? res.data : [];
        setApplications(apps);

        // Build real messages list from applications and system updates
        buildMessages(apps);
      } catch (err) {
        console.error('Failed to load applications:', err);
        setApplications([]);
        buildMessages([]);
      } finally {
        setLoadingApps(false);
      }
    };

    // If recruiter, also fetch their job listings
    const fetchRecruiterJobs = async () => {
      if (user?.role === 'recruiter') {
        try {
          const res = await api.get('/jobs');
          const allJobs = Array.isArray(res.data) ? res.data : res.data?.data || [];
          const ownJobs = allJobs.filter(
            (j) =>
              j.createdBy?._id === user._id ||
              j.createdBy === user._id ||
              j.createdBy?.email === user.email
          );
          setMyListings(ownJobs.length > 0 ? ownJobs : allJobs.slice(0, 5));
        } catch (err) {
          console.error('Failed to load recruiter jobs:', err);
        }
      }
    };

    fetchApplications();
    fetchRecruiterJobs();
  }, [user]);

  // Construct real notification messages based on user activity
  const buildMessages = (apps) => {
    const msgs = [];
    const lastRead = parseInt(
      localStorage.getItem(`messages_last_read_${user?._id || user?.email}`) || '0',
      10
    );

    // 1. Welcome Message
    msgs.push({
      id: 'welcome-msg',
      type: 'welcome',
      title: `Welcome to JobSearch, ${user?.name || 'User'}!`,
      sender: 'JobSearch Platform Team',
      time: 'Recent',
      content:
        'Your account is ready. Discover top matching opportunities, save jobs, and track your application milestones all in one place.',
      icon: Sparkles,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      read: true,
    });

    if (user?.role === 'recruiter') {
      // Recruiter: incoming candidate applications
      apps.forEach((app, idx) => {
        const job = app.jobId || {};
        const jobTitle = job.title || 'Position';
        const candidateName = app.fullName || app.applicantId?.name || 'A candidate';
        const dateStr = app.createdAt
          ? new Date(app.createdAt).toLocaleDateString()
          : 'Recently';
        const appTime = new Date(app.createdAt || 0).getTime();
        const isUnread = lastRead > 0 && appTime > lastRead;

        msgs.push({
          id: `recruiter-app-${app._id || idx}`,
          type: 'applicant',
          title: `New Applicant: ${candidateName}`,
          sender: `${candidateName} • ${jobTitle}`,
          time: dateStr,
          content: `${candidateName} has submitted an application for the "${jobTitle}" position. Contact: ${app.email || 'N/A'}${app.phone ? ' | ' + app.phone : ''}. Review their resume and details in the Candidates tab.`,
          icon: Users,
          iconColor: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
          jobId: job._id,
          read: !isUnread,
        });
      });
    } else {
      // Candidate: application updates
      apps.forEach((app, idx) => {
        const job = app.jobId || {};
        const jobTitle = job.title || 'Position';
        const company = job.company || 'Company';
        const status = app.status || 'applied';
        const dateStr = app.createdAt
          ? new Date(app.createdAt).toLocaleDateString()
          : 'Recently';

        if (status === 'shortlisted') {
          const updateTime = new Date(app.updatedAt || app.createdAt || 0).getTime();
          const isUnread = lastRead > 0 && updateTime > lastRead;

          msgs.push({
            id: `app-shortlisted-${app._id || idx}`,
            type: 'status',
            title: `Congratulations! Shortlisted for ${jobTitle}`,
            sender: company,
            time: dateStr,
            content: `Great news! Your application for "${jobTitle}" at ${company} was reviewed and shortlisted. The hiring team may reach out to schedule an interview soon.`,
            icon: CheckCircle,
            iconColor: 'text-green-500',
            bgColor: 'bg-green-500/10',
            jobId: job._id,
            read: !isUnread,
          });
        } else if (status === 'rejected') {
          msgs.push({
            id: `app-rejected-${app._id || idx}`,
            type: 'status',
            title: `Application Update: ${jobTitle}`,
            sender: company,
            time: dateStr,
            content: `Thank you for your interest in the "${jobTitle}" position at ${company}. The hiring team has decided to proceed with other candidates at this time.`,
            icon: XCircle,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-500/10',
            jobId: job._id,
            read: true,
          });
        } else {
          msgs.push({
            id: `app-applied-${app._id || idx}`,
            type: 'status',
            title: `Application Confirmed: ${jobTitle}`,
            sender: company,
            time: dateStr,
            content: `Your application and resume for "${jobTitle}" at ${company} were successfully delivered to the hiring manager.`,
            icon: Briefcase,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            jobId: job._id,
            read: true,
          });
        }
      });
    }

    setMessages(msgs);
  };

  // Remove saved job
  const handleRemoveSavedJob = (jobId, e) => {
    e?.stopPropagation();
    try {
      const updated = savedJobs.filter((j) => (j._id || j.id) !== jobId);
      setSavedJobs(updated);
      localStorage.setItem('saved_jobs', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
    }
  };

  // Recruiter: update candidate application status
  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: res.data.status } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const isRecruiter = user?.role === 'recruiter';

  // Dynamic stat cards
  const stats = [
    {
      id: isRecruiter ? 'listings' : 'applied',
      label: isRecruiter ? 'Active Listings' : 'Applied Jobs',
      value: isRecruiter ? myListings.length : applications.length,
      icon: Briefcase,
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-500',
      activeColor: 'border-blue-500 shadow-blue-500/20',
    },
    {
      id: isRecruiter ? 'applicants' : 'saved',
      label: isRecruiter ? 'Total Applications' : 'Saved Jobs',
      value: isRecruiter ? applications.length : savedJobs.length,
      icon: isRecruiter ? Users : Bookmark,
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-500',
      activeColor: 'border-purple-500 shadow-purple-500/20',
    },
    {
      id: 'messages',
      label: 'Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'from-pink-500/20 to-pink-600/20',
      textColor: 'text-pink-500',
      activeColor: 'border-pink-500 shadow-pink-500/20',
    },
  ];

  if (loading && !user) {
    return (
      <div className="bg-[var(--color-bg)] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Enforce authentication: show applied jobs & messages only when logged in
  if (!loading && !user) {
    return (
      <div className="bg-[var(--color-bg)] min-h-screen pt-36 pb-20 flex items-center justify-center px-4 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 md:p-10 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl text-center space-y-6 backdrop-blur-xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">
              Please Sign In to Access Dashboard
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Your applied jobs, recruitment messages, and bookmarked listings are private and available only after signing in.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/login?redirect=/dashboard"
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.02] text-sm"
            >
              Log In to Your Account
            </Link>
            <Link
              to="/register"
              className="w-full py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-purple-500/40 text-[var(--color-text-primary)] font-semibold rounded-2xl transition-all text-sm"
            >
              Create a Free Account
            </Link>
            <Link
              to="/jobs"
              className="text-xs text-[var(--color-text-muted)] hover:text-purple-500 transition-colors pt-2"
            >
              ← Or browse all public job postings as guest
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pt-32 pb-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:flex md:items-center md:justify-between mb-10"
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Welcome back, <span className="text-purple-500">{user?.name || 'User'}</span>
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)] flex items-center gap-2">
              Role:
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-500 ring-1 ring-inset ring-purple-500/20 uppercase tracking-widest">
                {user?.role || 'Candidate'}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                • {user?.email}
              </span>
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Browse Open Jobs
            </Link>
          </div>
        </motion.div>

        {/* ─── 3 Clickable Stat Cards ─── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {stats.map((stat, i) => {
            const isActive = activeTab === stat.id;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleTabChange(stat.id)}
                className={`bg-[var(--color-surface)] p-8 rounded-[32px] border transition-all cursor-pointer backdrop-blur-xl relative overflow-hidden group shadow-xl ${
                  isActive
                    ? `${stat.activeColor} ring-2 ring-purple-500/30 scale-[1.02]`
                    : 'border-[var(--color-border)] hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                      isActive
                        ? 'bg-purple-500 text-white'
                        : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] group-hover:text-purple-500'
                    }`}
                  >
                    {isActive ? 'Active Tab' : 'Click to View'}
                  </span>
                </div>

                <dt className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  {stat.label}
                </dt>
                <dd className="text-4xl font-extrabold text-[var(--color-text-primary)]">
                  {stat.value}
                </dd>

                <div
                  className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ─── Interactive Section Tabs ─── */}
        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 border-b border-[var(--color-border)]">
          {!isRecruiter && (
            <button
              onClick={() => handleTabChange('applied')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'applied'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Applied Jobs
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {applications.length}
              </span>
            </button>
          )}

          {!isRecruiter && (
            <button
              onClick={() => handleTabChange('saved')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Jobs
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {savedJobs.length}
              </span>
            </button>
          )}

          {isRecruiter && (
            <button
              onClick={() => handleTabChange('listings')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              My Job Listings
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {myListings.length}
              </span>
            </button>
          )}

          {isRecruiter && (
            <button
              onClick={() => handleTabChange('applicants')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'applicants'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
              }`}
            >
              <Users className="w-4 h-4" />
              Candidates & Applicants
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {applications.length}
              </span>
            </button>
          )}

          <button
            onClick={() => handleTabChange('messages')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages & Notifications
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white/20">
              {messages.length}
            </span>
          </button>
        </div>

        {/* ─── Tab Content Display ─── */}
        <AnimatePresence mode="wait">
          {/* 1. APPLIED JOBS TAB */}
          {activeTab === 'applied' && (
            <motion.div
              key="applied-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                    My Applied Jobs
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Track the real-time status of your applications
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-500">
                  {applications.length} total
                </span>
              </div>

              {loadingApps ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Loading your applications...
                  </p>
                </div>
              ) : applications.length === 0 ? (
                <div className="p-16 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] text-center shadow-xl space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[var(--color-text-primary)]">
                    No applications yet
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                    You haven’t submitted applications to any jobs yet. Browse thousands of
                    open positions and apply with a single click.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
                  >
                    Explore Open Jobs
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {applications.map((app) => {
                    const job = app.jobId || {};
                    const jobId = typeof job === 'object' ? job._id : job;
                    const status = app.status || 'applied';

                    let statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        Under Review
                      </span>
                    );
                    if (status === 'shortlisted') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Shortlisted
                        </span>
                      );
                    } else if (status === 'rejected') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Not Selected
                        </span>
                      );
                    }

                    return (
                      <div
                        key={app._id}
                        onClick={() => jobId && navigate(`/jobs/${jobId}`)}
                        className="p-6 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                      >
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-600/15 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-105 transition-transform">
                            <Building className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1.5">
                              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors line-clamp-1">
                                {job.title || 'Job Opening'}
                              </h4>
                              {statusBadge}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                              <span className="font-semibold text-[var(--color-text-primary)]">
                                {job.company || 'Company'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                                {job.location || 'Remote'}
                              </span>
                              {job.salary && (
                                <span className="text-green-500 font-semibold">
                                  {job.salary}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                                <Clock className="w-3.5 h-3.5" />
                                Applied:{' '}
                                {app.createdAt
                                  ? new Date(app.createdAt).toLocaleDateString()
                                  : 'Recently'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-bg)] hover:bg-purple-500/10 border border-[var(--color-border)] hover:border-purple-500/40 text-xs font-bold text-[var(--color-text-primary)] hover:text-purple-500 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Application Details
                          </button>
                          <Link
                            to={`/jobs/${jobId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-500 hover:text-white font-bold text-xs transition-all"
                          >
                            View Job
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* 2. SAVED JOBS TAB */}
          {activeTab === 'saved' && (
            <motion.div
              key="saved-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                    Saved Jobs
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Bookmarked opportunities for you to review and apply
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-500">
                  {savedJobs.length} saved
                </span>
              </div>

              {savedJobs.length === 0 ? (
                <div className="p-16 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] text-center shadow-xl space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto">
                    <Bookmark className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[var(--color-text-primary)]">
                    No saved jobs yet
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                    Save interesting opportunities while browsing by clicking the bookmark
                    button on any job card or job page.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
                  >
                    Browse Jobs Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedJobs.map((job) => {
                    const jobId = job._id || job.id;
                    return (
                      <div
                        key={jobId}
                        onClick={() => navigate(`/jobs/${jobId}`)}
                        className="p-6 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wider">
                              {job.jobType || 'Full-time'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSavedJob(jobId, e)}
                              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors line-clamp-2 mb-2">
                            {job.title}
                          </h4>

                          <p className="text-sm font-semibold text-purple-400 mb-3">
                            {job.company}
                          </p>

                          <div className="space-y-1.5 text-xs text-[var(--color-text-secondary)] mb-6">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-purple-500" />
                              <span>{job.location || 'Remote'}</span>
                            </div>
                            {job.salary && (
                              <div className="text-green-500 font-semibold">
                                {job.salary}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                          <span className="text-[11px] text-[var(--color-text-muted)]">
                            {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Active'}
                          </span>
                          <Link
                            to={`/jobs/${jobId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-400 transition-colors group/btn"
                          >
                            View & Apply
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* 3. MESSAGES & NOTIFICATIONS TAB */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                    Messages & Notifications
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Updates from recruiters, hiring managers, and system alerts
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-500">
                  {messages.length} messages
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="p-16 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] text-center shadow-xl space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[var(--color-text-primary)]">
                    No messages right now
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                    When recruiters review your applications or schedule interviews, updates
                    will appear right here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const IconComp = msg.icon || MessageSquare;
                    return (
                      <div
                        key={msg.id}
                        className="p-6 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/40 shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl ${
                              msg.bgColor || 'bg-purple-500/10'
                            } flex items-center justify-center ${
                              msg.iconColor || 'text-purple-500'
                            } shrink-0`}
                          >
                            <IconComp className="w-6 h-6" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                                {msg.title}
                              </h4>
                              {!msg.read && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                                  New
                                </span>
                              )}
                              <span className="text-[11px] font-semibold text-purple-400">
                                • {msg.sender}
                              </span>
                            </div>

                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                              {msg.content}
                            </p>

                            <div className="flex items-center gap-3 pt-2 text-xs text-[var(--color-text-muted)] font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{msg.time}</span>
                            </div>
                          </div>
                        </div>

                        {msg.jobId && (
                          <div className="shrink-0 self-end md:self-center">
                            <Link
                              to={`/jobs/${msg.jobId}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-500 hover:text-white font-bold text-xs transition-all"
                            >
                              View Job
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* 4. RECRUITER LISTINGS TAB */}
          {activeTab === 'listings' && isRecruiter && (
            <motion.div
              key="listings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                    My Active Listings
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Manage your job posts and incoming talent pipelines
                  </p>
                </div>
                <Link
                  to="/jobs"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
                >
                  View Live Catalog
                </Link>
              </div>

              {myListings.length === 0 ? (
                <div className="p-16 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] text-center shadow-xl space-y-4">
                  <h4 className="text-xl font-bold text-[var(--color-text-primary)]">
                    No active job postings
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Post a new role to start collecting qualified applicants.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myListings.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="p-6 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mt-1">
                            <span>{job.company}</span>
                            <span>• {job.location || 'Remote'}</span>
                            <span className="text-green-500 font-semibold">{job.salary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/jobs/${job._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 font-bold text-xs hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          View Listing
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 5. RECRUITER APPLICANTS TAB */}
          {activeTab === 'applicants' && isRecruiter && (
            <motion.div
              key="applicants-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                    Applicant Pipeline
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Review and update hiring decisions for your candidates
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-500">
                  {applications.length} candidates
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="p-16 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] text-center shadow-xl space-y-4">
                  <h4 className="text-xl font-bold text-[var(--color-text-primary)]">
                    No applications received yet
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    When job seekers apply to your roles, their resumes and profiles will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {applications.map((app) => {
                    const candidate = app.candidateId || {};
                    const job = app.jobId || {};
                    const applicantName = app.fullName || candidate.name || 'Candidate';
                    const applicantEmail = app.email || candidate.email || 'N/A';
                    const applicantPhone = app.phone || candidate.phone || '';
                    const applicantAddress = app.address || candidate.address || '';

                    return (
                      <div
                        key={app._id}
                        className="p-6 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 font-extrabold text-base">
                            {applicantName ? applicantName[0].toUpperCase() : 'C'}
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                                {applicantName}
                              </h4>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">
                                {job.title || 'Role'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-purple-500" />
                                {applicantEmail}
                              </span>
                              {applicantPhone && (
                                <span className="flex items-center gap-1 font-medium text-[var(--color-text-primary)]">
                                  <Phone className="w-3.5 h-3.5 text-green-500" />
                                  {applicantPhone}
                                </span>
                              )}
                              {applicantAddress && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                                  {applicantAddress}
                                </span>
                              )}
                            </div>

                            {app.coverNote && (
                              <p className="text-xs text-[var(--color-text-secondary)] italic bg-[var(--color-bg)] p-2.5 rounded-xl border border-[var(--color-border)] mt-2">
                                "{app.coverNote}"
                              </p>
                            )}

                            {app.resume && (
                              <div className="pt-1 flex items-center gap-2">
                                <a
                                  href={app.resume.startsWith('http') ? app.resume : `https://${app.resume}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  View Resume / Portfolio
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Recruiter decision controls */}
                        <div className="flex items-center gap-3 shrink-0">
                          <select
                            value={app.status || 'applied'}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option value="applied">Status: Applied</option>
                            <option value="shortlisted">Status: Shortlist</option>
                            <option value="rejected">Status: Reject</option>
                          </select>

                          {job._id && (
                            <Link
                              to={`/jobs/${job._id}`}
                              className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-purple-500/10 text-purple-500"
                              title="View job"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Real Recent Activity Feed ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-[var(--color-surface)] rounded-[36px] p-8 md:p-10 border border-[var(--color-border)] shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Recent Activity Timeline
            </h3>
          </div>

          <div className="space-y-3">
            {applications.length === 0 && savedJobs.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                No recent activity. Start by browsing and applying to jobs!
              </p>
            ) : (
              <>
                {applications.slice(0, 3).map((app) => {
                  const job = app.jobId || {};
                  return (
                    <div
                      key={app._id}
                      onClick={() => job._id && navigate(`/jobs/${job._id}`)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-purple-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors">
                            Applied to {job.title || 'Role'} at {job.company || 'Company'}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Status: <span className="font-semibold text-purple-400 capitalize">{app.status || 'Applied'}</span>
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  );
                })}

                {savedJobs.slice(0, 2).map((job) => (
                  <div
                    key={job._id || job.id}
                    onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-purple-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors">
                          Saved {job.title} at {job.company}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          Bookmarked in your personal list
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Application Details Modal */}
        <AnimatePresence>
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between pb-6 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-600/15 flex items-center justify-center text-purple-500 shrink-0">
                      <Building className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                        {selectedApp.jobId?.title || 'Job Opening'}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                        {selectedApp.jobId?.company || 'Company'} • {selectedApp.jobId?.location || 'Remote'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-6 space-y-6">
                  {/* Status Timeline */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-muted)] mb-4">
                      Application Milestone Tracker
                    </h4>
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] text-center">
                      <div className="space-y-1">
                        <div className="w-8 h-8 rounded-full bg-green-500/15 text-green-500 flex items-center justify-center mx-auto text-xs font-bold">
                          ✓
                        </div>
                        <p className="text-xs font-bold text-[var(--color-text-primary)]">Submitted</p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleDateString() : 'Recorded'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                          selectedApp.status === 'shortlisted'
                            ? 'bg-green-500/15 text-green-500'
                            : selectedApp.status === 'rejected'
                            ? 'bg-red-500/15 text-red-500'
                            : 'bg-blue-500/15 text-blue-500 animate-pulse'
                        }`}>
                          {selectedApp.status === 'shortlisted' ? '✓' : selectedApp.status === 'rejected' ? '✕' : '⏳'}
                        </div>
                        <p className="text-xs font-bold text-[var(--color-text-primary)]">
                          {selectedApp.status === 'applied' ? 'In Review' : 'Reviewed'}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">Hiring Team</p>
                      </div>

                      <div className="space-y-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                          selectedApp.status === 'shortlisted'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                            : selectedApp.status === 'rejected'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-gray-500/15 text-gray-500'
                        }`}>
                          {selectedApp.status === 'shortlisted' ? '★' : selectedApp.status === 'rejected' ? '✕' : '•'}
                        </div>
                        <p className="text-xs font-bold text-[var(--color-text-primary)] capitalize">
                          {selectedApp.status === 'shortlisted'
                            ? 'Shortlisted'
                            : selectedApp.status === 'rejected'
                            ? 'Decision Made'
                            : 'Pending'}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">Outcome</p>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Contact Details Submitted */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      Candidate Contact Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-semibold mb-0.5">Full Name</span>
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {selectedApp.fullName || user?.name || 'Applicant'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-semibold mb-0.5">Email Address</span>
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {selectedApp.email || user?.email || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-semibold mb-0.5">Mobile Number</span>
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {selectedApp.phone || user?.phone || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-semibold mb-0.5">Current Address / Location</span>
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {selectedApp.address || user?.address || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedApp.coverNote && (
                    <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Submitted Cover Note
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] italic leading-relaxed">
                        "{selectedApp.coverNote}"
                      </p>
                    </div>
                  )}

                  {/* Submission Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">Application Reference</p>
                      <p className="text-xs font-mono font-bold text-[var(--color-text-primary)] truncate">
                        {selectedApp._id}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">Current Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        selectedApp.status === 'shortlisted'
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : selectedApp.status === 'rejected'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {selectedApp.status || 'Applied (Under Review)'}
                      </span>
                    </div>
                  </div>

                  {/* Resume Info */}
                  <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-purple-500" /> Submitted Resume / Portfolio Link
                      </p>
                      <p className="text-xs font-mono font-medium text-[var(--color-text-primary)] truncate max-w-sm">
                        {selectedApp.resume || 'Profile resume linked at time of application'}
                      </p>
                    </div>
                    {selectedApp.resume && (
                      <a
                        href={selectedApp.resume.startsWith('http') ? selectedApp.resume : `https://${selectedApp.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-500 hover:text-white font-bold text-xs transition-all shrink-0 cursor-pointer"
                      >
                        Open Resume
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    to={`/jobs/${selectedApp.jobId?._id || selectedApp.jobId}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    View Original Job Posting
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
