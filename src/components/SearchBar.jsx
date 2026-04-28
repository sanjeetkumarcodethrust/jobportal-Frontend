import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, initialValues = {} }) => {
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
    onSearch({ skills, experience, location });
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-4xl mx-auto bg-[var(--color-surface)] backdrop-blur-xl border border-[var(--color-border)] rounded-[32px] p-6 shadow-2xl relative z-10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full flex items-center gap-3 px-5 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl focus-within:border-purple-500/50 transition-colors">
          <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Enter skills / designations / companies"
            className="bg-transparent w-full outline-none text-[var(--color-text-primary)] text-sm"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48 flex items-center gap-3 px-5 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl">
          <Briefcase className="w-5 h-5 text-[var(--color-text-muted)]" />
          <select 
            className="bg-transparent w-full outline-none text-[var(--color-text-primary)] text-sm appearance-none cursor-pointer"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="" className="dark:bg-gray-900 bg-white">Select exp</option>
            <option value="fresher" className="dark:bg-gray-900 bg-white">Fresher</option>
            <option value="1-3" className="dark:bg-gray-900 bg-white">1-3 Years</option>
            <option value="3-5" className="dark:bg-gray-900 bg-white">3-5 Years</option>
            <option value="5+" className="dark:bg-gray-900 bg-white">5+ Years</option>
          </select>
        </div>

        <div className="flex-1 w-full flex items-center gap-3 px-5 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl">
          <MapPin className="w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Enter location"
            className="bg-transparent w-full outline-none text-[var(--color-text-primary)] text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Search Jobs
        </button>
      </form>

      {/* Popular Searches */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-[var(--color-text-muted)]">Popular Searches:</span>
        {['Data Analyst', 'React Developer', 'Product Manager', 'UI/UX Designer', 'Python Developer'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSkills(tag)}
            className="px-4 py-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-purple-500/50 transition-all cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchBar;
