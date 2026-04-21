import { useState } from 'react';
import { Search, MapPin, ChevronDown, Sparkles, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const EXPERIENCE_OPTIONS = [
  'Fresher',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
  '6-10 Years',
  '10+ Years',
];

const TRENDING_SEARCHES = [
  'Remote Jobs',
  'React Developer',
  'Data Analyst',
  'Product Manager',
  'UX Designer',
];

const Hero = () => {
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search handler – would integrate with router/API
    console.log({ skills, experience, location });
  };

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--hero-gradient-start) 0%, var(--hero-gradient-mid) 50%, var(--hero-gradient-end) 100%)',
      }}
    >
      {/* ── Decorative Background Elements ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-300/5 dark:bg-purple-500/3 blur-3xl" />
        
        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-400/20 dark:bg-indigo-400/10"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        {/* ── Badge ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles className="w-4 h-4" />
            <span>#1 Job Platform in India</span>
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
        </motion.div>

        {/* ── Heading ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Find your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                dream job
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </span>{' '}
            now
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium"
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">5 lakh+</span> jobs for you to explore across top companies
          </motion.p>
        </motion.div>

        {/* ── Search Bar ─── */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-12 max-w-4xl mx-auto"
          id="job-search-form"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl ring-1 ring-gray-200/50 dark:ring-slate-700/50 p-2 sm:p-2.5">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              {/* Skills Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:border-r border-gray-200 dark:border-slate-700">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                <input
                  type="text"
                  id="search-skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter skills / designations / companies"
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                />
              </div>

              {/* Experience Dropdown */}
              <div className="relative flex items-center px-4 py-3 sm:border-r border-gray-200 dark:border-slate-700 sm:w-48">
                <button
                  type="button"
                  id="search-experience"
                  onClick={() => setIsExpDropdownOpen(!isExpDropdownOpen)}
                  className="flex items-center justify-between w-full gap-2 text-sm text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <span className={experience ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {experience || 'Select experience'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isExpDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-slate-700 py-2 z-20 max-h-48 overflow-auto">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setExperience(opt); setIsExpDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          experience === opt
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                <input
                  type="text"
                  id="search-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                id="search-submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-sm px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/30 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </motion.form>

        {/* ── Trending Searches ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Trending:</span>
          </div>
          {TRENDING_SEARCHES.map((term) => (
            <button
              key={term}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border border-gray-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
            >
              {term}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
