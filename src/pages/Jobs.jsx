import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, DollarSign, Clock, Search, ArrowRight } from 'lucide-react';
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
  const initialValues = {
    skills: searchParams.get('skills') || '',
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

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
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
              Find your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">dream job</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
              Explore thousands of job opportunities and take the next step in your career.
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
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                {loading ? 'Searching jobs...' : `${jobs.length} Jobs Found`}
              </h2>
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
              </motion.div>
            ) : jobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-[40px] border border-[var(--color-border)] shadow-2xl backdrop-blur-xl w-full"
              >
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">No jobs found</h3>
                <p>Try adjusting your search filters to find more opportunities.</p>
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
                    </div>

                    <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="flex items-center text-xs text-[var(--color-text-muted)] font-medium">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.postedAt || job.createdAt ? new Date(job.postedAt || job.createdAt).toLocaleDateString() : 'Active Now'}
                      </div>
                      <button className="flex items-center gap-2 text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors group/btn">
                        View Job
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
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
