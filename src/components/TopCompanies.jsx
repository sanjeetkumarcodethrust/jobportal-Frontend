import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const COMPANIES = [
  { name: 'Google', logo: 'https://www.vectorlogo.zone/logos/google/google-icon.svg', color: 'group-hover:shadow-red-500/20' },
  { name: 'Microsoft', logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg', color: 'group-hover:shadow-blue-500/20' },
  { name: 'Amazon', logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg', color: 'group-hover:shadow-orange-500/20' },
  { name: 'IBM', logo: 'https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg', color: 'group-hover:shadow-blue-800/20' },
  { name: 'Netflix', logo: 'https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg', color: 'group-hover:shadow-red-600/20' },
  { name: 'Meta', logo: 'https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg', color: 'group-hover:shadow-blue-600/20' },
  { name: 'Apple', logo: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg', color: 'group-hover:shadow-gray-400/20' },
  { name: 'Tesla', logo: 'https://www.vectorlogo.zone/logos/tesla/tesla-icon.svg', color: 'group-hover:shadow-red-500/20' },
];

const TopCompanies = ({ showHeader = true }) => {
  return (
    <section className="py-24 bg-[var(--color-bg)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Top Companies Hiring</h2>
            <Link to="/companies" className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-bold group">
              View all companies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className={`group flex items-center justify-center p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm transition-all duration-500 ${company.color} hover:bg-[var(--color-surface)] hover:shadow-2xl hover:border-purple-500/30 overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <img
                src={company.logo}
                alt={company.name}
                className="h-10 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 relative z-10 dark:invert-[0.1] dark:group-hover:invert-0"
                onError={(e) => {
                   e.target.style.display = 'none';
                   if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden text-xs font-bold text-[var(--color-text-primary)] relative z-10">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;

