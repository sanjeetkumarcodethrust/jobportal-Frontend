import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, initialValues = {}, activeTab = 'Find Jobs' }) => {
  const [skills, setSkills] = useState(initialValues.skills || '');
  const [experience, setExperience] = useState(initialValues.experience || '');
  const [location, setLocation] = useState(initialValues.location || '');

  useEffect(() => {
    setSkills(initialValues.skills || '');
    setExperience(initialValues.experience || '');
    setLocation(initialValues.location || '');
  }, [initialValues.skills, initialValues.experience, initialValues.location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ skills: skills.trim(), experience: experience.trim(), location: location.trim() });
  };

  const handleClear = () => {
    setSkills('');
    setExperience('');
    setLocation('');
    onSearch({ skills: '', experience: '', location: '' });
  };

  const handleTagClick = (tag) => {
    setSkills(tag);
    onSearch({ skills: tag, experience, location });
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'Companies':
        return 'Enter company name (e.g. Swiggy, Uber, Barclays)...';
      case 'Skills':
        return 'Enter skills (e.g. React, Node.js, Python)...';
      case 'Locations':
        return 'Enter job title or role...';
      default:
        return 'Job name, skills, or designation...';
    }
  };

  const hasValues = Boolean(skills || experience || location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-4xl mx-auto bg-[var(--color-surface)] backdrop-blur-xl border border-[var(--color-border)] rounded-[32px] p-6 shadow-2xl relative z-10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        {/* Job Name / Skills / Title Input */}
        <div className="flex-1 w-full flex items-center gap-3 px-5 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl focus-within:border-purple-500/50 transition-colors">
          <Search className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />
          <input
            type="text"
            placeholder={getPlaceholder()}
            className="bg-transparent w-full outline-none text-[var(--color-text-primary)] text-sm"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        {/* Experience Select */}
        <div className="w-full md:w-56 flex items-center gap-3 px-5 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl">
          <Briefcase className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />
          <select 
            className="bg-transparent w-full outline-none text-[var(--color-text-primary)] text-sm appearance-none cursor-pointer"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Experience (All)</option>
            <option value="fresher" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Fresher / 0-1 yrs</option>
            <option value="1-3" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">1-3 Years</option>
            <option value="3-5" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">3-5 Years</option>
            <option value="5+" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">5+ Years (Senior)</option>
          </select>
        </div>

        {/* Location Input */}
        <div className="flex-1 w-full flex items-center gap-3 px-5 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl">
          <MapPin className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Location (e.g. Pune, Bangalore, Remote)"
            className="bg-transparent w-full outline-none text-[var(--color-text-primary)] text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {hasValues && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear all search inputs"
              className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--color-text-muted)] hover:text-red-500 rounded-2xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            Search Jobs
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-[var(--color-text-muted)]">Popular Searches:</span>
        {['Data Analyst', 'React Developer', 'Product Manager', 'Full Stack Developer', 'Software Engineer'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="px-4 py-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchBar;
