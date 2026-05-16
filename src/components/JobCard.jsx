import React from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-[var(--color-surface)] rounded-[32px] p-8 border border-[var(--color-border)] shadow-xl hover:shadow-purple-500/5 transition-all group backdrop-blur-xl relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-110 transition-transform">
          <Building className="w-7 h-7" />
        </div>
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20 uppercase tracking-wider">
          {job.jobType || 'Full-time'}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-purple-500 transition-colors line-clamp-2">
        {job.title}
      </h3>
      
      <div className="space-y-3 mb-8">
        <div className="flex items-center text-[var(--color-text-secondary)]">
          <Building className="w-5 h-5 mr-3 shrink-0 text-purple-500/70" />
          <span className="font-semibold text-[var(--color-text-primary)] line-clamp-1">
            {job.company || job.companyName || 'Top Company'}
          </span>
        </div>
        <div className="flex items-center text-[var(--color-text-secondary)]">
          <MapPin className="w-5 h-5 mr-3 shrink-0" />
          <span className="line-clamp-1">{job.location || 'Remote'}</span>
        </div>
        <div className="flex items-center text-[var(--color-text-secondary)]">
          <DollarSign className="w-5 h-5 mr-3 shrink-0" />
          <span className="font-medium line-clamp-1">{job.salary || 'Competitive Salary'}</span>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center text-xs text-[var(--color-text-muted)] font-medium">
          <Clock className="w-4 h-4 mr-2" />
          {job.postedAt || job.createdAt ? new Date(job.postedAt || job.createdAt).toLocaleDateString() : 'Active Now'}
        </div>
        <Link to={`/jobs/${job._id || job.id}`} className="flex items-center gap-2 text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors group/btn">
          View Job
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
    </motion.div>
  );
};

export default JobCard;
