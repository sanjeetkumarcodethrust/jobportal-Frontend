import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, DollarSign, Clock } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get(`/jobs${location.search}`);
        setJobs(res.data?.data || res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [location.search]);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Explore <span className="text-indigo-600 dark:text-indigo-400">Opportunities</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Find your dream job from our list of latest openings.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p>Check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {job.jobType || 'Full-time'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Building className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate font-medium">{job.company || job.companyName || 'Unknown Company'}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <DollarSign className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">{job.salary || 'Salary not disclosed'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                  <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                    View Details &rarr;
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
