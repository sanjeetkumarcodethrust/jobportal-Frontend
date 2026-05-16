import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

const JobFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    category: [],
  });

  // Keep local state in sync with initial values (from URL)
  useEffect(() => {
    if (initialFilters) {
      setFilters({
        jobType: initialFilters.jobType ? initialFilters.jobType.split(',') : [],
        experience: initialFilters.experience ? initialFilters.experience.split(',') : [],
        category: initialFilters.category ? initialFilters.category.split(',') : [],
      });
    }
  }, [initialFilters]);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  
  // These categories are popular ones. They could be fetched dynamically, but hardcoding for demo is fine
  const categories = ['Software Development', 'Data Science', 'Design', 'Marketing', 'Sales', 'Product', 'HR', 'Finance'];
  
  const experiences = ['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'];

  const handleCheckboxChange = (filterCategory, value) => {
    const currentValues = filters[filterCategory];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
      
    const newFilters = { ...filters, [filterCategory]: newValues };
    setFilters(newFilters);
    
    // Convert array to comma-separated string for the parent component/URL
    onFilterChange({
      jobType: newFilters.jobType.join(','),
      experience: newFilters.experience.join(','),
      category: newFilters.category.join(',')
    });
  };

  const clearFilters = () => {
    const emptyFilters = { jobType: [], experience: [], category: [] };
    setFilters(emptyFilters);
    onFilterChange({ jobType: '', experience: '', category: '' });
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <div className="bg-[var(--color-surface)] rounded-[32px] p-6 border border-[var(--color-border)] shadow-xl relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Job Type Filter */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Job Type</h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-[var(--color-border)] rounded md:rounded-md checked:bg-purple-500 checked:border-purple-500 transition-colors cursor-pointer"
                    checked={filters.jobType.includes(type)}
                    onChange={() => handleCheckboxChange('jobType', type)}
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-purple-500 transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Experience Level</h3>
          <div className="space-y-2">
            {experiences.map((exp) => (
              <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-[var(--color-border)] rounded md:rounded-md checked:bg-purple-500 checked:border-purple-500 transition-colors cursor-pointer"
                    checked={filters.experience.includes(exp)}
                    onChange={() => handleCheckboxChange('experience', exp)}
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-purple-500 transition-colors">
                  {exp}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-[var(--color-border)] rounded md:rounded-md checked:bg-purple-500 checked:border-purple-500 transition-colors cursor-pointer"
                    checked={filters.category.includes(cat)}
                    onChange={() => handleCheckboxChange('category', cat)}
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-purple-500 transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
