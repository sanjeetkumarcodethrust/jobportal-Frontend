import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  GraduationCap,
  Tag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Share2,
  Bookmark,
  Send,
  AlertCircle,
  UserCheck,
  ExternalLink,
  User,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application state
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [modalStep, setModalStep] = useState('form'); // 'form' | 'success'
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const modalScrollRef = useRef(null);

  // Complete applicant details
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    resume: '',
    coverNote: '',
  });

  // Always scroll window to top whenever a new job is opened
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  // Lock body scroll and reset modal scroll when opening apply modal
  useEffect(() => {
    if (showApplyModal) {
      document.body.style.overflow = 'hidden';
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showApplyModal]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || (user.jobPreferences?.locations?.[0] || ''),
        resume: prev.resume || user.resume || '',
        coverNote: prev.coverNote || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchJobAndApplication = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);

        // Check if this job is saved in localStorage
        try {
          const savedList = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
          const isSaved = savedList.some((j) => (j._id || j.id) === id);
          setSaved(isSaved);
        } catch {
          // Ignore
        }

        // Check if user has already applied
        if (user && user.role === 'candidate') {
          try {
            const appsRes = await api.get('/applications/my');
            const applications = Array.isArray(appsRes.data) ? appsRes.data : [];
            const hasApplied = applications.some((app) => {
              const appId = typeof app.jobId === 'object' ? app.jobId?._id : app.jobId;
              return appId === id;
            });
            if (hasApplied) {
              setApplied(true);
            }
          } catch {
            // Non-critical check, continue quietly
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Job not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobAndApplication();
    }
  }, [id, user]);

  const openApplyModal = () => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    setModalStep(applied ? 'success' : 'form');
    setApplyError('');
    setShowApplyModal(true);
  };

  const handleApply = async (e) => {
    e?.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role === 'recruiter') {
      setApplyError('Recruiter accounts cannot apply for jobs. Please log in as a candidate.');
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      return;
    }

    if (!formData.fullName.trim()) {
      setApplyError('Please enter your full name.');
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      return;
    }
    if (!formData.email.trim()) {
      setApplyError('Please enter your email address.');
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      return;
    }
    if (!formData.phone.trim()) {
      setApplyError('Please enter your mobile phone number.');
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      return;
    }
    if (!formData.address.trim()) {
      setApplyError('Please enter your address or current city.');
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      return;
    }
    if (!formData.resume.trim()) {
      setApplyError('Please provide a resume URL or link (Google Drive, Dropbox, PDF).');
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      return;
    }

    setApplying(true);
    setApplyError('');
    setApplySuccess('');

    try {
      await api.post(`/apply/${id}`, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        resume: formData.resume.trim(),
        coverNote: formData.coverNote.trim(),
      });

      setApplied(true);
      setApplySuccess('Application submitted successfully! Your full details have been sent to the employer.');
      setModalStep('success');
    } catch (err) {
      console.error('Application failed:', err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to submit application. Please check your details and try again.';
      setApplyError(errMsg);
      if (errMsg.toLowerCase().includes('already applied')) {
        setApplied(true);
        setModalStep('success');
      } else {
        if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
      }
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveToggle = () => {
    if (!job) return;
    try {
      const savedList = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
      let updated;
      if (saved) {
        updated = savedList.filter((j) => (j._id || j.id) !== id);
        setSaved(false);
      } else {
        updated = [
          ...savedList.filter((j) => (j._id || j.id) !== id),
          {
            _id: job._id || id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            jobType: job.jobType,
            experience: job.experience,
            category: job.category,
            postedAt: job.postedAt || job.createdAt,
          },
        ];
        setSaved(true);
      }
      localStorage.setItem('saved_jobs', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update saved jobs:', err);
    }
  };

  const isHtml = (str) => {
    if (!str || typeof str !== 'string') return false;
    return /<[a-z][\s\S]*>/i.test(str);
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-bg)] min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-semibold text-[var(--color-text-secondary)]">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-[var(--color-bg)] min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--color-surface)] border border-red-500/20 rounded-[32px] p-10 max-w-lg text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Job Not Found</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            {error || 'This job posting may have been removed or is no longer accepting applications.'}
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Jobs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pt-28 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-bold text-[var(--color-text-primary)] hover:border-purple-500/40 transition-all"
              title="Copy job link"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-500" />
              {copied ? 'Link Copied!' : 'Share'}
            </button>
            <button
              onClick={handleSaveToggle}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                saved
                  ? 'border-purple-500 bg-purple-500/10 text-purple-500'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-purple-500/40'
              }`}
              title="Save this job"
            >
              <Bookmark className="w-3.5 h-3.5" />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {applySuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-semibold text-sm"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{applySuccess}</span>
            </div>
            <Link
              to="/dashboard?tab=applied"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs transition-colors shrink-0"
            >
              View in Applied Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {applyError && !showApplyModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center gap-3 font-semibold text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{applyError}</span>
          </motion.div>
        )}

        {/* Main Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[36px] p-8 md:p-10 shadow-2xl backdrop-blur-xl mb-10 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative z-10">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 shadow-inner">
                <Building className="w-10 h-10" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20 uppercase tracking-wider">
                    {job.jobType || 'Full-time'}
                  </span>
                  {job.category && (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400">
                      {job.category}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight mb-2">
                  {job.title}
                </h1>
                <p className="text-xl font-bold text-purple-500 mb-4">{job.company}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500/80" />
                    <span>{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500/80" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {job.salary || 'Competitive Salary'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500/80" />
                    <span>
                      Posted{' '}
                      {job.postedAt || job.createdAt
                        ? new Date(job.postedAt || job.createdAt).toLocaleDateString()
                        : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right Action Button */}
            <div className="md:shrink-0 flex flex-col sm:flex-row gap-3">
              {applied ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 font-bold text-sm shadow-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>Applied</span>
                  </div>
                  <Link
                    to="/dashboard?tab=applied"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 font-bold text-sm transition-all"
                  >
                    View Status in Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : user?.role === 'recruiter' ? (
                <div className="px-5 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Recruiter View
                </div>
              ) : (
                <button
                  onClick={openApplyModal}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Apply for this Role
                </button>
              )}
            </div>
          </div>

          <div className="absolute -right-16 -top-16 w-56 h-56 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Left Column: Description & Skills */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  Experience
                </div>
                <p className="text-base font-bold text-[var(--color-text-primary)]">
                  {job.experience || 'Not specified'}
                </p>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  Job Type
                </div>
                <p className="text-base font-bold text-[var(--color-text-primary)]">
                  {job.jobType || 'Full-time'}
                </p>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  <Tag className="w-4 h-4 text-purple-500" />
                  Category
                </div>
                <p className="text-base font-bold text-[var(--color-text-primary)] line-clamp-1">
                  {job.category || 'General'}
                </p>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  Salary
                </div>
                <p className="text-base font-bold text-[var(--color-text-primary)] line-clamp-1">
                  {job.salary || 'Competitive'}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 shadow-xl">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-500" />
                  Required Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Description Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-purple-500" />
                Job Description & Overview
              </h2>

              {isHtml(job.description) ? (
                <div
                  className="job-description-content text-[var(--color-text-secondary)] space-y-4 text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--color-text-primary)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--color-text-primary)] [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[var(--color-text-primary)] [&_strong]:text-[var(--color-text-primary)] [&_strong]:font-semibold [&_a]:text-purple-500 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              ) : (
                <p className="whitespace-pre-line text-base text-[var(--color-text-secondary)] leading-relaxed">
                  {job.description || 'No detailed description provided.'}
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar: Quick Actions & Employer Info */}
          <div className="space-y-8">
            {/* Quick Apply Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 shadow-xl">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                Interested in this position?
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Submit your profile and resume directly to {job.company} hiring managers.
              </p>

              {applied ? (
                <div className="w-full py-4 px-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Application Submitted
                </div>
              ) : user?.role === 'recruiter' ? (
                <div className="w-full py-4 px-4 rounded-2xl bg-purple-500/10 text-purple-400 font-bold text-center text-sm">
                  Recruiter View Only
                </div>
              ) : (
                <button
                  onClick={openApplyModal}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {user ? 'Apply Now' : 'Sign In to Apply'}
                </button>
              )}

              {user && (
                <p className="text-xs text-[var(--color-text-muted)] text-center mt-3">
                  Applying as <span className="font-semibold text-purple-500">{user.name}</span> ({user.email})
                </p>
              )}
            </div>

            {/* Company / Recruiter Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-500" />
                About the Company
              </h3>
              <div>
                <p className="text-xl font-extrabold text-[var(--color-text-primary)]">{job.company}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                  {job.location || 'Remote'}
                </p>
              </div>

              {job.createdBy && (
                <div className="pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                  <span>Job posted by: </span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {job.createdBy.name || 'Verified Recruiter'}
                  </span>
                </div>
              )}
            </div>

            {/* Security Guarantee / Advice */}
            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <p className="font-bold text-blue-400 mb-1">Safety Advisory</p>
              Job listings on this platform are verified. Never pay any fee or deposit for an interview, test, or job offer.
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowApplyModal(false);
                setApplyError('');
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[28px] sm:rounded-[32px] max-w-xl w-full shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {modalStep === 'success' ? (
                /* ─── SUCCESS SCREEN: Never leaves the user wondering "nothing can show" ─── */
                <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-500 shadow-xl shadow-green-500/15">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="absolute -inset-2 bg-green-500/20 blur-xl rounded-full -z-10" />
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Submitted Successfully
                    </span>
                    <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                      Application Received!
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 max-w-md mx-auto">
                      Your application for <span className="font-bold text-purple-500">{job.title}</span> has been securely delivered to <span className="font-bold text-[var(--color-text-primary)]">{job.company}</span>.
                    </p>
                  </div>

                  {/* Submission Summary Box */}
                  <div className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5 shadow-inner">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)] pb-2 flex items-center justify-between">
                      <span>Submitted Details</span>
                      <span className="text-green-500 font-semibold lowercase">status: under review</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-medium">Full Name:</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{formData.fullName || user?.name}</span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-medium">Contact Email:</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{formData.email || user?.email}</span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-medium">Mobile Number:</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{formData.phone || 'Provided'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)] block font-medium">Address:</span>
                        <span className="font-bold text-[var(--color-text-primary)]">{formData.address || 'Provided'}</span>
                      </div>
                    </div>
                    {formData.resume && (
                      <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                        <span className="text-[var(--color-text-muted)] shrink-0">Resume:</span>
                        <span className="font-mono text-[11px] text-blue-500 truncate max-w-xs">{formData.resume}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyModal(false);
                        navigate('/dashboard?tab=applied');
                      }}
                      className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      View in Applied Jobs (Dashboard)
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="w-full sm:w-auto py-3 px-6 rounded-2xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── FORM STEP: With fixed header, scrollable body, and fixed footer ─── */
                <form onSubmit={handleApply} className="flex flex-col flex-1 overflow-hidden">
                  {/* Fixed Modal Header - Always in view */}
                  <div className="p-5 sm:p-6 pb-4 border-b border-[var(--color-border)] flex items-start justify-between gap-4 shrink-0 bg-[var(--color-surface)]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-500 mb-1.5">
                        <Sparkles className="w-3 h-3" />
                        Direct Application
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] leading-tight">
                        Apply to {job.company}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Role: <span className="font-bold text-purple-500">{job.title}</span> • {job.location || 'Remote'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyModal(false);
                        setApplyError('');
                      }}
                      className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Form Body - ALWAYS resets to top on open */}
                  <div
                    ref={modalScrollRef}
                    className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4"
                  >
                    {applyError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{applyError}</span>
                      </div>
                    )}

                    {/* Candidate Personal Details */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-500" />
                        Applicant Contact Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="e.g. John Doe"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="e.g. candidate@example.com"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="e.g. +91 98765 43210"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1">
                            Address / City <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="e.g. Mumbai, Maharashtra"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resume Submission */}
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-500" />
                        Resume / Portfolio Link <span className="text-red-500">*</span>
                      </h4>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.resume}
                          onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                          placeholder="https://drive.google.com/... or uploaded resume link"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                        Google Drive, Dropbox, Notion, or personal portfolio PDF link accessible to recruiters.
                      </p>
                    </div>

                    {/* Cover Note */}
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                          Cover Note (Optional)
                        </label>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Optional</span>
                      </div>
                      <textarea
                        rows="2"
                        value={formData.coverNote}
                        onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                        placeholder="Briefly describe your experience or why you'd be a great fit..."
                        className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Fixed Modal Footer - Always in view */}
                  <div className="p-4 sm:p-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3 shrink-0 bg-[var(--color-surface)]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyModal(false);
                        setApplyError('');
                      }}
                      className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={applying}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {applying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Confirm & Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Apply Bar - Always visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-lg border-t border-[var(--color-border)] p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">
            {job.title}
          </p>
          <p className="text-[11px] text-green-500 font-semibold truncate">
            {job.salary || job.company}
          </p>
        </div>

        {applied ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-bold shrink-0">
            <CheckCircle className="w-4 h-4" />
            Applied
          </div>
        ) : user?.role === 'recruiter' ? (
          <div className="px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-bold shrink-0">
            Recruiter View
          </div>
        ) : (
          <button
            onClick={openApplyModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;

