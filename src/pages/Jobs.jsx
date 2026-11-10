import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, DollarSign, Clock, Search, ArrowRight, RotateCcw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import JobFilters from '../components/JobFilters';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial values from URL
  const searchParams = new URLSearchParams(location.search);
  const companyQuery = searchParams.get('company') || '';
  const initialValues = {
    skills: searchParams.get('skills') || searchParams.get('search') || '',
    experience: searchParams.get('experience') || '',
    location: searchParams.get('location') || '',
  };

  const handleSearch = (searchData) => {
    const params = new URLSearchParams(location.search);
    if (searchData.skills) params.set('skills', searchData.skills);
    else params.delete('skills');
    
    if (searchData.experience) params.set('experience', searchData.experience);
    else params.delete('experience');
    
    if (searchData.location) params.set('location', searchData.location);
    else params.delete('location');
    
    navigate(`/jobs?${params.toString()}`);
  };

  const handleFilterChange = (filterData) => {
    const params = new URLSearchParams(location.search);
    
    if (filterData.jobType) params.set('jobType', filterData.jobType);
    else params.delete('jobType');
    
    if (filterData.experience) params.set('experience', filterData.experience);
    else params.delete('experience');
    
    if (filterData.category) params.set('category', filterData.category);
    else params.delete('category');
    
    navigate(`/jobs?${params.toString()}`);
  };

  const handleRemoveFilter = (paramKey) => {
    const params = new URLSearchParams(location.search);
    params.delete(paramKey);
    if (paramKey === 'skills') {
      params.delete('search');
    }
    const queryString = params.toString();
    navigate(queryString ? `/jobs?${queryString}` : '/jobs');
  };

  const handleResetFilters = () => {
    navigate('/jobs');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
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

  const hasActiveFilters = Boolean(
    companyQuery ||
    initialValues.skills ||
    initialValues.experience ||
    initialValues.location ||
    searchParams.get('jobType') ||
    searchParams.get('category')
  );

  return (
    <div className="bg-[var(--color-bg)] min-h-screen transition-colors duration-500">
      {/* ── Header Section ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[var(--color-border)]">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 dark:bg-purple-600/10 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-4">
              {companyQuery ? (
                <>
                  Open Positions at <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{companyQuery}</span>
                </>
              ) : (
                <>
                  Find your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">dream job</span>
                </>
              )}
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
              {companyQuery 
                ? `Explore verified career opportunities and high-impact open roles currently hiring at ${companyQuery}.`
                : "Explore thousands of job opportunities and take the next step in your career."}
            </p>
            <SearchBar onSearch={handleSearch} initialValues={initialValues} />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 shrink-0">
            <JobFilters 
              onFilterChange={handleFilterChange} 
              initialFilters={{
                jobType: searchParams.get('jobType'),
                experience: searchParams.get('experience'),
                category: searchParams.get('category')
              }} 
            />
          </div>

          {/* Job Results */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  {loading ? 'Searching jobs...' : `${jobs.length} Jobs Found`}
                </h2>
                {hasActiveFilters && !loading && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-[var(--color-text-muted)] font-medium">Active:</span>
                    {companyQuery && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Building className="w-3.5 h-3.5" />
                        Company: {companyQuery}
                        <button
                          onClick={() => handleRemoveFilter('company')}
                          className="hover:text-red-500 transition-colors ml-1 font-bold text-sm cursor-pointer"
                          title="Clear company filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {initialValues.skills && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        Role: {initialValues.skills}
                        <button
                          onClick={() => handleRemoveFilter('skills')}
                          className="hover:text-red-500 transition-colors ml-1 font-bold text-sm cursor-pointer"
                          title="Clear skill filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {initialValues.experience && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Exp: {initialValues.experience}
                        <button
                          onClick={() => handleRemoveFilter('experience')}
                          className="hover:text-red-500 transition-colors ml-1 font-bold text-sm cursor-pointer"
                          title="Clear experience filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {initialValues.location && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <MapPin className="w-3.5 h-3.5" />
                        {initialValues.location}
                        <button
                          onClick={() => handleRemoveFilter('location')}
                          className="hover:text-red-500 transition-colors ml-1 font-bold text-sm cursor-pointer"
                          title="Clear location filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchParams.get('jobType') && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        Type: {searchParams.get('jobType')}
                        <button
                          onClick={() => handleRemoveFilter('jobType')}
                          className="hover:text-red-500 transition-colors ml-1 font-bold text-sm cursor-pointer"
                          title="Clear job type filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchParams.get('category') && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Cat: {searchParams.get('category')}
                        <button
                          onClick={() => handleRemoveFilter('category')}
                          className="hover:text-red-500 transition-colors ml-1 font-bold text-sm cursor-pointer"
                          title="Clear category filter"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-purple-500 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset all filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                </div>
                <p className="mt-4 text-[var(--color-text-secondary)] font-medium">Fetching best jobs for you...</p>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-[32px] text-center max-w-2xl mx-auto"
              >
                <p className="text-lg font-bold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </motion.div>
            ) : jobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-6 text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-[40px] border border-[var(--color-border)] shadow-2xl backdrop-blur-xl w-full"
              >
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">No matching jobs found</h3>
                <p className="max-w-md mx-auto mb-8 text-sm text-[var(--color-text-muted)]">
                  We couldn't find exact matches for your search. Try broadening your keywords, clearing experience levels, or exploring all opportunities.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Clear Filters & Show All Jobs
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                    className="bg-[var(--color-surface)] rounded-[32px] p-8 border border-[var(--color-border)] shadow-xl hover:shadow-purple-500/5 transition-all group backdrop-blur-xl relative overflow-hidden cursor-pointer"
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
                        <span className="font-semibold text-[var(--color-text-primary)] line-clamp-1">{job.company || job.companyName || 'Top Company'}</span>
                      </div>
                      <div className="flex items-center text-[var(--color-text-secondary)]">
                        <MapPin className="w-5 h-5 mr-3 shrink-0" />
                        <span className="line-clamp-1">{job.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center text-[var(--color-text-secondary)]">
                        <DollarSign className="w-5 h-5 mr-3 shrink-0" />
                        <span className="font-medium line-clamp-1">{job.salary || 'Competitive Salary'}</span>
                      </div>
                      <div className="flex items-center text-[var(--color-text-secondary)]">
                        <Briefcase className="w-5 h-5 mr-3 shrink-0 text-purple-500/70" />
                        <span className="text-xs font-medium line-clamp-1">{job.experience || 'Experience: Any'}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="flex items-center text-xs text-[var(--color-text-muted)] font-medium">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.postedAt || job.createdAt ? new Date(job.postedAt || job.createdAt).toLocaleDateString() : 'Active Now'}
                      </div>
                      <Link 
                        to={`/jobs/${job._id || job.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors group/btn"
                      >
                        View Job
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Decorative Gradient */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
