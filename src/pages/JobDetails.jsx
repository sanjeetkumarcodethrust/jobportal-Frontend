import { useState, useEffect, useContext } from 'react';
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
  CheckCircle,
  Share2,
  Bookmark,
  Send,
  AlertCircle,
  UserCheck,
  ExternalLink,
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
  const [resumeInput, setResumeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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

        // Pre-fill resume input if user has one
        if (user?.resume) {
          setResumeInput(user.resume);
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

  const handleApply = async (e) => {
    e?.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role === 'recruiter') {
      setApplyError('Recruiter accounts cannot apply for jobs. Please log in as a candidate.');
      return;
    }

    setApplying(true);
    setApplyError('');
    setApplySuccess('');

    try {
      const resumeToSend = resumeInput.trim() || user?.resume;
      await api.post(`/apply/${id}`, { resume: resumeToSend });

      setApplied(true);
      setApplySuccess('Application submitted successfully! You can track its status in your Dashboard.');
      setShowApplyModal(false);
    } catch (err) {
      console.error('Application failed:', err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to submit application. Please provide a resume link.';
      setApplyError(errMsg);
      if (errMsg.toLowerCase().includes('already applied')) {
        setApplied(true);
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
            className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 flex items-center gap-3 font-semibold text-sm"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{applySuccess}</span>
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
            <div className="md:shrink-0 flex flex-col gap-3">
              {applied ? (
                <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 font-bold text-base shadow-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Applied</span>
                </div>
              ) : user?.role === 'recruiter' ? (
                <div className="px-5 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Recruiter View
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
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
                  onClick={() => setShowApplyModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Apply to {job.company}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Role: <span className="font-semibold text-purple-500">{job.title}</span>
              </p>

              {applyError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                    Resume Link / URL or File Path
                  </label>
                  <input
                    type="text"
                    required
                    value={resumeInput}
                    onChange={(e) => setResumeInput(e.target.value)}
                    placeholder="https://drive.google.com/... or uploaded resume"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                    {user?.resume
                      ? 'Loaded from your profile resume. You can update or replace it here.'
                      : 'Provide a link to your Google Drive, Dropbox, portfolio, or PDF resume.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyModal(false);
                      setApplyError('');
                    }}
                    className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2"
                  >
                    {applying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirm & Apply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetails;

