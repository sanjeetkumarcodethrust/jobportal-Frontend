// src/components/JobCard.jsx
// Presentational component for a single job entry.
// Uses the existing design tokens (CSS variables) for a premium look.

import React from 'react';
import { motion } from 'framer-motion';

const JobCard = ({ job }) => {
  const { title, company, location, experience, description } = job;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--color-surface)] backdrop-blur-xl border border-[var(--color-border)] rounded-[24px] p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-1">{company}</p>
      <p className="text-sm text-[var(--color-text-muted)] mb-2">
        <span className="mr-2">{location}</span>
        <span>{experience ? `${experience} experience` : ''}</span>
      </p>
      {description && (
        <p className="text-sm text-[var(--color-text-primary)] line-clamp-3 mb-4">{description}</p>
      )}
      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm hover:from-blue-600 hover:to-indigo-700 transition-all">
        Apply
      </button>
    </motion.div>
  );
};

export default JobCard;
