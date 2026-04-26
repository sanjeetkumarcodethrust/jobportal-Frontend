import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const COMPANIES = [
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', color: 'group-hover:shadow-red-500/10' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', color: 'group-hover:shadow-blue-500/10' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', color: 'group-hover:shadow-orange-500/10' },
  { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', color: 'group-hover:shadow-blue-400/10' },
  { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', color: 'group-hover:shadow-blue-600/10' },
  { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', color: 'group-hover:shadow-purple-500/10' },
  { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Deloitte.svg', color: 'group-hover:shadow-green-500/10' },
  { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', color: 'group-hover:shadow-blue-800/10' },
];

const TopCompanies = () => {
  return (
    <section className="py-24 bg-[var(--color-bg)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Top Companies Hiring</h2>
          <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-semibold group">
            View all companies
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className={`group flex items-center justify-center p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-all duration-300 ${company.color} hover:shadow-xl`}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all duration-300 dark:brightness-0 dark:invert group-hover:dark:brightness-100 group-hover:dark:invert-0"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;
