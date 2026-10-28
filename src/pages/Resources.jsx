import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Video,
  MessageSquare,
  Download,
  Copy,
  Check,
  Eye,
  X,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Bookmark,
  Share2,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Code,
  Award,
  ArrowRight,
  ShieldCheck,
  Play,
  Filter,
  CheckCircle
} from 'lucide-react';
import {
  resumeTemplates,
  interviewModules,
  webinarsData,
  careerArticles
} from '../data/resourcesData';

const Resources = () => {
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'resumes' | 'interview' | 'webinars' | 'blog'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Resume Filters & Modals
  const [resumeRoleFilter, setResumeRoleFilter] = useState('all');
  const [previewResume, setPreviewResume] = useState(null);
  const [copiedResumeId, setCopiedResumeId] = useState(null);
  const [showAtsTips, setShowAtsTips] = useState(false);

  // Interview State
  const [activeInterviewModule, setActiveInterviewModule] = useState('dsa');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [masteredQuestions, setMasteredQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('resources_mastered_questions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Webinars State
  const [webinarTab, setWebinarTab] = useState('upcoming');
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [registeredWebinars, setRegisteredWebinars] = useState(() => {
    try {
      const saved = localStorage.getItem('resources_registered_webinars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [rsvpFormData, setRsvpFormData] = useState({ name: '', email: '', role: 'Software Engineer' });

  // Blog State
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('resources_bookmarked_articles');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync Mastered Questions with localStorage
  const toggleMasteredQuestion = (qId) => {
    setMasteredQuestions(prev => {
      const updated = { ...prev, [qId]: !prev[qId] };
      localStorage.setItem('resources_mastered_questions', JSON.stringify(updated));
      showToast(updated[qId] ? 'Question marked as mastered! 🎯' : 'Question unmastered.');
      return updated;
    });
  };

  // Sync Bookmarks with localStorage
  const toggleBookmark = (artId) => {
    setBookmarkedArticles(prev => {
      const updated = { ...prev, [artId]: !prev[artId] };
      localStorage.setItem('resources_bookmarked_articles', JSON.stringify(updated));
      showToast(updated[artId] ? 'Article saved to bookmarks! 📌' : 'Bookmark removed.');
      return updated;
    });
  };

  // Toggle Question Expansion
  const toggleQuestionExpand = (qId) => {
    setExpandedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Copy Resume Text
  const handleCopyResume = (resume) => {
    navigator.clipboard.writeText(resume.rawText);
    setCopiedResumeId(resume.id);
    showToast('Resume template copied to clipboard! 📋');
    setTimeout(() => setCopiedResumeId(null), 2500);
  };

  // Download Resume Template as Markdown File
  const handleDownloadResume = (resume) => {
    const filename = `${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.md`;
    const blob = new Blob([resume.rawText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}! 🚀`);
  };

  // RSVP Submission
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!selectedWebinar) return;
    const updated = {
      ...registeredWebinars,
      [selectedWebinar.id]: {
        name: rsvpFormData.name,
        email: rsvpFormData.email,
        date: new Date().toISOString()
      }
    };
    setRegisteredWebinars(updated);
    localStorage.setItem('resources_registered_webinars', JSON.stringify(updated));
    showToast(`Registered for ${selectedWebinar.title}! Check your email for access link.`);
    setSelectedWebinar(null);
  };

  // Filter Resumes
  const filteredResumes = resumeTemplates.filter(t => {
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = resumeRoleFilter === 'all' || t.id.includes(resumeRoleFilter);
    return matchesSearch && matchesRole;
  });

  // Filter Blog Articles
  const filteredArticles = careerArticles.filter(art => {
    const matchesSearch = searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = blogCategoryFilter === 'all' || art.category.toLowerCase().includes(blogCategoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  // Overview Cards (Matching user's original hero cards but now fully functional!)
  const overviewCards = [
    {
      id: 'resumes',
      icon: FileText,
      title: 'Resume Templates',
      category: 'Guide',
      time: '6 Templates',
      badge: '98%+ ATS Pass',
      desc: 'Free ATS-proof resumes formatted for top tech companies.',
      color: 'from-blue-500/20 to-cyan-500/10',
      accent: 'text-blue-500',
      borderGlow: 'hover:border-blue-500/60'
    },
    {
      id: 'interview',
      icon: BookOpen,
      title: 'Interview Preparation',
      category: 'Course',
      time: '4 Modules • 40+ Topics',
      badge: 'Coding & System Design',
      desc: 'High-frequency algorithms, system design architectures, and STAR scripts.',
      color: 'from-purple-500/20 to-pink-500/10',
      accent: 'text-purple-500',
      borderGlow: 'hover:border-purple-500/60'
    },
    {
      id: 'webinars',
      icon: Video,
      title: 'Webinars & Events',
      category: 'Live',
      time: 'Weekly Live & On-Demand',
      badge: 'Free Registration',
      desc: 'Interactive live workshops led by FAANG engineers & recruiters.',
      color: 'from-rose-500/20 to-amber-500/10',
      accent: 'text-rose-500',
      borderGlow: 'hover:border-rose-500/60'
    },
    {
      id: 'blog',
      icon: MessageSquare,
      title: 'Career Blog',
      category: 'Article',
      time: 'Deep Insights',
      badge: 'Actionable Strategies',
      desc: 'Tested salary negotiation tactics, cold outreach scripts, and hiring trends.',
      color: 'from-emerald-500/20 to-teal-500/10',
      accent: 'text-emerald-500',
      borderGlow: 'hover:border-emerald-500/60'
    },
  ];

  const handleCardClick = (tabId) => {
    setActiveTab(tabId);
    const targetElement = document.getElementById('resource-content-area');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 min-h-[90vh] bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 border border-white/10 dark:border-gray-200 shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Hero */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Complete Career Accelerator Toolkit
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-5 tracking-tight"
          >
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500">Resources</span>
          </motion.h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Click on any section below to access free ATS resume templates, interview algorithm cheat-sheets, live recruiter webinars, and industry career guides.
          </p>
        </div>

        {/* 4 Interactive Overview Cards (Directly matching the screenshot but now clickable & responsive!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {overviewCards.map((res) => {
            const isSelected = activeTab === res.id;
            return (
              <motion.div
                key={res.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCardClick(res.id)}
                className={`cursor-pointer p-1 rounded-3xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 shadow-xl shadow-blue-500/20'
                    : 'bg-gradient-to-br from-[var(--color-border)] to-transparent hover:from-blue-500/40'
                }`}
              >
                <div className="p-7 rounded-[22px] bg-[var(--color-surface)] h-full flex flex-col justify-between transition-colors duration-200">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${res.color} flex items-center justify-center shrink-0 border border-white/5`}>
                        <res.icon className={`w-7 h-7 ${res.accent}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold uppercase tracking-wider ${res.accent}`}>{res.category}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)] font-medium">
                            {res.badge}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors">
                          {res.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {res.time}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                    {res.desc}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]/60 text-xs font-bold">
                    <span className={`${isSelected ? res.accent : 'text-[var(--color-text-secondary)]'} flex items-center gap-1.5`}>
                      {isSelected ? 'Currently Viewing Section' : 'Explore Full Section'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[var(--color-text-muted)] font-normal">Instant Access</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Search & Tab Pill Bar */}
        <div id="resource-content-area" className="scroll-mt-28 mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
            
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Resources' },
                { id: 'resumes', label: 'Resume Templates' },
                { id: 'interview', label: 'Interview Prep' },
                { id: 'webinars', label: 'Webinars & Events' },
                { id: 'blog', label: 'Career Blog' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates, algorithms, webinars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: RESUME TEMPLATES
        ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'resumes') && (
          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">
                    ATS-Optimized Resume Templates
                  </h2>
                </div>
                <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                  Built specifically to pass automated applicant tracking systems (Greenhouse, Lever, Workday) with 95%+ parsing scores.
                </p>
              </div>

              {/* ATS Tips Toggle */}
              <button
                onClick={() => setShowAtsTips(!showAtsTips)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                {showAtsTips ? 'Hide ATS Guidelines' : 'View ATS Golden Rules'}
              </button>
            </div>

            {/* ATS Guidelines Accordion */}
            <AnimatePresence>
              {showAtsTips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-cyan-500/5 border border-blue-500/20"
                >
                  <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    How to Guarantee Your Resume Passes the ATS Robot:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[var(--color-text-secondary)]">
                    <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <strong className="text-[var(--color-text-primary)] block mb-1">1. Single Column Only</strong>
                      Multi-column resumes confuse parsers, causing them to read across columns and scramble your history.
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <strong className="text-[var(--color-text-primary)] block mb-1">2. Google XYZ Formula</strong>
                      "Accomplished [X] as measured by [Y], by doing [Z]". Recruiters look for metrics, percentages, and latency drops.
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <strong className="text-[var(--color-text-primary)] block mb-1">3. No Icons, Tables or Boxes</strong>
                      Never put contact information or skills inside text boxes. Parsers frequently skip canvas layers entirely.
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <strong className="text-[var(--color-text-primary)] block mb-1">4. Standard Section Headers</strong>
                      Use "Work Experience", "Education", and "Technical Skills" rather than creative phrasing.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'sde', label: 'Software Engineer' },
                { id: 'product', label: 'Product Manager' },
                { id: 'data', label: 'Data Science & AI' },
                { id: 'fresher', label: 'Fresher / Campus' },
                { id: 'ui-ux', label: 'UI/UX Design' },
                { id: 'executive', label: 'Engineering Manager' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setResumeRoleFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    resumeRoleFilter === f.id
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30 font-bold'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-blue-500/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((tmpl) => (
                <motion.div
                  key={tmpl.id}
                  layout
                  className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-blue-500/50 transition-all duration-300 p-6 flex flex-col justify-between group shadow-sm hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {tmpl.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {tmpl.atsScore}% ATS Pass
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mb-1">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs font-medium text-blue-500/80 mb-3">{tmpl.role}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                      {tmpl.summary}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {tmpl.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                          <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewResume(tmpl)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Full Resume
                      </button>
                      <button
                        onClick={() => handleCopyResume(tmpl)}
                        title="Copy plain markdown text"
                        className="p-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-border)]/50 text-[var(--color-text-secondary)] transition-colors shrink-0"
                      >
                        {copiedResumeId === tmpl.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDownloadResume(tmpl)}
                      className="w-full py-2 rounded-xl border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Markdown (.MD)
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2: INTERVIEW PREPARATION
        ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'interview') && (
          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">
                    Interview Preparation Modules
                  </h2>
                </div>
                <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                  Tested answers, system design architectures, and salary negotiation frameworks used at Tier-1 companies.
                </p>
              </div>

              {/* Progress Tracker */}
              <div className="px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-[var(--color-text-secondary)]">
                  Mastered: <strong className="text-[var(--color-text-primary)]">{Object.values(masteredQuestions).filter(Boolean).length}</strong> questions
                </span>
              </div>
            </div>

            {/* Modules Pill Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {interviewModules.map((mod) => {
                const isActive = activeInterviewModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveInterviewModule(mod.id)}
                    className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-purple-500/30'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 block mb-1">
                      {mod.badge}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{mod.title}</h4>
                  </button>
                );
              })}
            </div>

            {/* Active Module Details */}
            {(() => {
              const currentMod = interviewModules.find(m => m.id === activeInterviewModule) || interviewModules[0];
              return (
                <div className="p-6 md:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-2">
                      {currentMod.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                      {currentMod.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {currentMod.topics.map((top, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs bg-[var(--color-border)]/60 text-[var(--color-text-secondary)] font-medium">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Questions Accordion */}
                  <div className="space-y-4">
                    {currentMod.questions.map((q) => {
                      const isExpanded = !!expandedQuestions[q.id];
                      const isMastered = !!masteredQuestions[q.id];
                      return (
                        <div
                          key={q.id}
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                            isMastered
                              ? 'border-emerald-500/40 bg-emerald-500/5'
                              : 'border-[var(--color-border)] bg-[var(--color-bg)]'
                          }`}
                        >
                          <div
                            onClick={() => toggleQuestionExpand(q.id)}
                            className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                  q.difficulty === 'Easy'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : q.difficulty === 'Medium'
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : 'bg-rose-500/10 text-rose-500'
                                }`}
                              >
                                {q.difficulty}
                              </span>
                              <h4 className="text-sm md:text-base font-bold text-[var(--color-text-primary)]">
                                {q.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMasteredQuestion(q.id);
                                }}
                                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                                  isMastered
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-[var(--color-text-muted)] hover:text-emerald-500 bg-[var(--color-border)]/50'
                                }`}
                                title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-5 pb-6 pt-2 border-t border-[var(--color-border)] text-sm space-y-4"
                              >
                                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-500 font-medium">
                                  <strong>Quick Summary:</strong> {q.summary}
                                </div>

                                <div>
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                                    Recommended Solution & Breakdown:
                                  </h5>
                                  <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs md:text-sm text-[var(--color-text-secondary)] whitespace-pre-line leading-relaxed font-sans">
                                    {q.approach}
                                  </div>
                                </div>

                                {q.codeSnippet && (
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                                        Code Implementation / Strategy Script:
                                      </span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(q.codeSnippet);
                                          showToast('Code snippet copied! 💻');
                                        }}
                                        className="text-xs text-purple-500 hover:text-purple-400 font-semibold flex items-center gap-1"
                                      >
                                        <Copy className="w-3.5 h-3.5" /> Copy Code
                                      </button>
                                    </div>
                                    <pre className="p-4 rounded-xl bg-gray-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
                                      {q.codeSnippet}
                                    </pre>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* =========================================================================
            SECTION 3: WEBINARS & LIVE EVENTS
        ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'webinars') && (
          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Video className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">
                    Live Webinars & Masterclasses
                  </h2>
                </div>
                <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                  Live workshops and recorded deep dives hosted by engineering leaders and recruiters.
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shrink-0">
                <button
                  onClick={() => setWebinarTab('upcoming')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    webinarTab === 'upcoming'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Upcoming Live ({webinarsData.filter(w => w.status === 'upcoming').length})
                </button>
                <button
                  onClick={() => setWebinarTab('recorded')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    webinarTab === 'recorded'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  On-Demand Video ({webinarsData.filter(w => w.status === 'recorded').length})
                </button>
              </div>
            </div>

            {/* Webinars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webinarsData
                .filter(w => w.status === webinarTab)
                .map((webinar) => {
                  const isRegistered = !!registeredWebinars[webinar.id];
                  return (
                    <motion.div
                      key={webinar.id}
                      layout
                      className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-rose-500/50 transition-all duration-300 p-7 flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              webinar.status === 'upcoming'
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            }`}
                          >
                            {webinar.status === 'upcoming' ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                Live Online
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                On-Demand Recording
                              </>
                            )}
                          </span>

                          <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                            {webinar.status === 'upcoming' ? (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-rose-500" />
                                {webinar.attendees} Registered
                              </span>
                            ) : (
                              <span>{webinar.views}</span>
                            )}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                          {webinar.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mb-5 leading-relaxed">
                          {webinar.description}
                        </p>

                        {/* Speaker Bio */}
                        <div className="p-3.5 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] mb-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                            {webinar.speaker.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{webinar.speaker}</h4>
                            <p className="text-[11px] text-[var(--color-text-secondary)]">{webinar.speakerRole}</p>
                          </div>
                        </div>

                        {/* Agenda */}
                        <div className="space-y-2 mb-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                            Key Takeaways & Agenda:
                          </span>
                          {webinar.agenda.map((ag, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span>{ag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-[var(--color-border)]">
                        {webinar.status === 'upcoming' ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-[var(--color-text-secondary)]">
                              <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)]">
                                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                {webinar.date}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                {webinar.time}
                              </div>
                            </div>

                            {isRegistered ? (
                              <div className="flex items-center gap-2">
                                <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/20">
                                  <Check className="w-4 h-4" /> Registered
                                </span>
                                <a
                                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinar.title)}&details=${encodeURIComponent(webinar.description)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white hover:bg-rose-600 transition-colors"
                                  title="Add to Google Calendar"
                                >
                                  <Calendar className="w-4 h-4" />
                                </a>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedWebinar(webinar)}
                                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                              >
                                Register Free (RSVP)
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                              Duration: <strong>{webinar.duration}</strong>
                            </div>
                            <button
                              onClick={() => setActiveVideoModal(webinar)}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              Watch Recording
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 4: CAREER BLOG
        ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'blog') && (
          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)]">
                    Career Blog & Strategy Guides
                  </h2>
                </div>
                <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                  Actionable, field-tested guides on hiring algorithms, salary negotiations, and engineering promotions.
                </p>
              </div>

              {/* Tag filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['all', 'Job Search', 'Resume Tips', 'Interview Prep', 'Networking'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setBlogCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      blogCategoryFilter === cat
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-emerald-500/40'
                    }`}
                  >
                    {cat === 'all' ? 'All Articles' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((art) => {
                const isBookmarked = !!bookmarkedArticles[art.id];
                return (
                  <motion.div
                    key={art.id}
                    layout
                    className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-500/50 transition-all duration-300 p-7 flex flex-col justify-between shadow-sm group"
                  >
                    <div>
                      {/* Meta */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {art.category}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                          <span>{art.readTime}</span>
                          <button
                            onClick={() => toggleBookmark(art.id)}
                            className={`transition-colors ${isBookmarked ? 'text-emerald-500' : 'hover:text-emerald-500'}`}
                            title={isBookmarked ? 'Bookmarked' : 'Save article'}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors mb-3 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    {/* Author & Action */}
                    <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.author.avatar}
                          alt={art.author.name}
                          className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{art.author.name}</h4>
                          <p className="text-[10px] text-[var(--color-text-muted)]">{art.author.role}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveArticleModal(art)}
                        className="px-4 py-2 rounded-xl bg-[var(--color-bg)] hover:bg-emerald-600 hover:text-white border border-[var(--color-border)] hover:border-transparent text-xs font-bold text-[var(--color-text-primary)] transition-all flex items-center gap-1.5"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* =========================================================================
          MODAL 1: RESUME PREVIEW MODAL
      ========================================================================= */}
      <AnimatePresence>
        {previewResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                    {previewResume.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    ATS-Optimized Plain Format • {previewResume.atsScore}% Matching Score
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyResume(previewResume)}
                    className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-border)]/50 text-xs font-bold flex items-center gap-1 text-[var(--color-text-secondary)]"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Text
                  </button>
                  <button
                    onClick={() => handleDownloadResume(previewResume)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Download className="w-3.5 h-3.5" /> Download (.MD)
                  </button>
                  <button
                    onClick={() => setPreviewResume(null)}
                    className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto font-mono text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed bg-[var(--color-surface)]">
                {previewResume.rawText}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: WEBINAR RSVP MODAL
      ========================================================================= */}
      <AnimatePresence>
        {selectedWebinar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-7 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedWebinar(null)}
                className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
                <Calendar className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
                Register for Free Webinar
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-6">
                "{selectedWebinar.title}" with {selectedWebinar.speaker}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanjeet Kumar"
                    value={rsvpFormData.name}
                    onChange={(e) => setRsvpFormData({ ...rsvpFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1">Email Address (For Zoom/Stream Link)</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={rsvpFormData.email}
                    onChange={(e) => setRsvpFormData({ ...rsvpFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1">Current Target Role</label>
                  <select
                    value={rsvpFormData.role}
                    onChange={(e) => setRsvpFormData({ ...rsvpFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-rose-500"
                  >
                    <option value="Software Engineer">Software Engineer / SDE</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Data Scientist">Data Scientist / AI Engineer</option>
                    <option value="College Student">College Student / Fresher</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/25 transition-all"
                  >
                    Confirm Free Registration (Instant RSVP)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 3: VIDEO RECORDING MODAL
      ========================================================================= */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {activeVideoModal.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Masterclass by {activeVideoModal.speaker} • {activeVideoModal.duration}
                  </p>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video bg-black w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6 bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)] space-y-2">
                <strong className="text-[var(--color-text-primary)] block">Topics Covered in this Session:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {activeVideoModal.agenda.map((ag, idx) => (
                    <li key={idx}>{ag}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 4: FULL ARTICLE READER MODAL
      ========================================================================= */}
      <AnimatePresence>
        {activeArticleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500">
                  {activeArticleModal.category} • {activeArticleModal.readTime}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: activeArticleModal.title,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Article link copied to clipboard!');
                      }
                    }}
                    className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    title="Share Article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(activeArticleModal.id)}
                    className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-emerald-500"
                    title="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedArticles[activeArticleModal.id] ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => setActiveArticleModal(null)}
                    className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] mb-4 leading-tight">
                    {activeArticleModal.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <img
                      src={activeArticleModal.author.avatar}
                      alt={activeArticleModal.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{activeArticleModal.author.name}</h4>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{activeArticleModal.author.role} • {activeArticleModal.publishedAt}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs md:text-sm text-[var(--color-text-secondary)] italic">
                  "{activeArticleModal.excerpt}"
                </div>

                <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-[var(--color-text-secondary)] whitespace-pre-line leading-relaxed">
                  {activeArticleModal.content}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;
