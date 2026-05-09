// src/components/JobList.jsx
// Fetches job listings based on filters and displays them using JobCard.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { searchJobs } from '../api/jobService';
import JobCard from './JobCard';

const JobList = ({ filters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchJobs(filters);
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [JSON.stringify(filters)]); // stringify to trigger when object changes

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full"
        />
        <span className="ml-4 text-[var(--color-text-primary)]">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500" role="alert">
        {error}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-muted)]">
        No jobs found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {jobs.map((job) => (
        <JobCard key={job.id || job._id || Math.random()} job={job} />
      ))}
    </motion.div>
  );
};

export default JobList;
