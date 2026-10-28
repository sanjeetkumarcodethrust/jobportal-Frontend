import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  X,
  Send,
  Star,
  Clock,
  HelpCircle
} from 'lucide-react';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [requestFormData, setRequestFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const services = [
    {
      id: 'priority',
      icon: Zap,
      title: 'Priority Applicant',
      desc: 'Get your application highlighted at the very top of recruiter dashboards and stand out from thousands of candidates.',
      badge: '2.5x Faster Response',
      price: 'Free with Profile Completion',
      color: 'from-amber-500/20 to-orange-500/10',
      accent: 'text-amber-500',
      features: [
        'Top placement in recruiter search queries',
        'Direct email notification sent to hiring leads',
        'Application read receipts and status tracking',
        'Early access to newly posted openings'
      ]
    },
    {
      id: 'international',
      icon: Globe,
      title: 'International Opportunities',
      desc: 'Discover high-paying remote, hybrid, or on-site opportunities in the US, Europe, Singapore, and across the globe.',
      badge: 'Global Sponsorship',
      price: 'Curated Access',
      color: 'from-blue-500/20 to-cyan-500/10',
      accent: 'text-blue-500',
      features: [
        'Visa sponsorship eligible listings filter',
        'Global remote compensation benchmark guide',
        'Timezone overlap and work-permit guidance',
        'Direct access to multinational engineering hubs'
      ]
    },
    {
      id: 'verified',
      icon: Shield,
      title: 'Verified Candidate Profile',
      desc: 'Earn a verified badge on your profile to build immediate credibility and trust with tier-1 employer hiring managers.',
      badge: 'Trust Score 99%',
      price: 'Instant Verification',
      color: 'from-purple-500/20 to-pink-500/10',
      accent: 'text-purple-500',
      features: [
        'Blue verified checkmark on candidate card',
        'Automated background & credential authentication',
        'Skill endorsement badges from verified assessments',
        'Preferred recruiter outreach ranking'
      ]
    },
    {
      id: 'coaching',
      icon: Headphones,
      title: '1-on-1 Career Coaching',
      desc: 'Connect with seasoned industry engineering managers and lead recruiters for personalized resume reviews and mock interviews.',
      badge: '1:1 Mentorship',
      price: 'Schedule 30-Min Session',
      color: 'from-emerald-500/20 to-teal-500/10',
      accent: 'text-emerald-500',
      features: [
        'Line-by-line ATS resume optimization',
        'Mock algorithmic or system design whiteboard interview',
        'Real-time behavioral feedback via STAR method',
        'Salary offer evaluation and counter-offer strategy'
      ]
    },
  ];

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    showToast(`Service request received for ${selectedService.title}! Our team will contact you at ${requestFormData.email}.`);
    setSelectedService(null);
    setRequestFormData({ name: '', email: '', notes: '' });
  };

  return (
    <div className="pt-24 min-h-[85vh] bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 border border-white/10 dark:border-gray-200 shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Career Boost Services
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6"
          >
            Our Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">Services</span>
          </motion.h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Accelerate your job hunt with verified credentials, priority applicant positioning, and direct mentorship from industry leaders.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-7 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 transition-all duration-300 group flex flex-col justify-between shadow-sm hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                    <service.icon className={`w-6 h-6 ${service.accent}`} />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-purple-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {service.desc}
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-[var(--color-border)]">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${service.accent}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full py-2.5 rounded-xl bg-[var(--color-bg)] hover:bg-purple-600 hover:text-white border border-[var(--color-border)] hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-500" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-xs md:text-sm text-[var(--color-text-secondary)]">
            <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              <strong className="text-[var(--color-text-primary)] block mb-1">How does Priority Applicant positioning work?</strong>
              When recruiters search candidate pools, verified priority applicants are pinned to the top 10% of results, significantly increasing interview invitation rates.
            </div>
            <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              <strong className="text-[var(--color-text-primary)] block mb-1">How long does Candidate Verification take?</strong>
              Our automated system verifies your LinkedIn and GitHub profiles within 5 minutes. If manual review of certificates is needed, it takes under 24 hours.
            </div>
          </div>
        </div>

      </div>

      {/* Booking / Request Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-7 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center`}>
                  <selectedService.icon className={`w-6 h-6 ${selectedService.accent}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {selectedService.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {selectedService.price}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                {selectedService.desc}
              </p>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sanjeet Kumar"
                    value={requestFormData.name}
                    onChange={(e) => setRequestFormData({ ...requestFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sanjeet@example.com"
                    value={requestFormData.email}
                    onChange={(e) => setRequestFormData({ ...requestFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1">Specific Requirements or Target Role (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Preparing for SDE-2 interview in 2 weeks..."
                    value={requestFormData.notes}
                    onChange={(e) => setRequestFormData({ ...requestFormData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Service Request
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

export default Services;
