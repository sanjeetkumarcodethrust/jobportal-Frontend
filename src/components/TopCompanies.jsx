import { motion } from 'framer-motion';
import { ArrowRight, Building, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const COMPANIES = [
  {
    name: 'Google',
    logo: 'https://www.vectorlogo.zone/logos/google/google-icon.svg',
    tag: 'Cloud & AI',
    color: 'hover:border-red-500/40 hover:shadow-red-500/10',
    badgeColor: 'bg-red-500/10 text-red-400',
  },
  {
    name: 'Microsoft',
    logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
    tag: 'Cloud Platform',
    color: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
    badgeColor: 'bg-blue-500/10 text-blue-400',
  },
  {
    name: 'Amazon',
    logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg',
    tag: 'E-Commerce / AWS',
    color: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    badgeColor: 'bg-amber-500/10 text-amber-400',
  },
  {
    name: 'Uber',
    logo: 'https://www.vectorlogo.zone/logos/uber/uber-icon.svg',
    tag: 'Mobility & Tech',
    color: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
    badgeColor: 'bg-purple-500/10 text-purple-400',
  },
  {
    name: 'Meta',
    logo: 'https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg',
    tag: 'Social & AI',
    color: 'hover:border-blue-600/40 hover:shadow-blue-600/10',
    badgeColor: 'bg-blue-600/10 text-blue-400',
  },
  {
    name: 'Netflix',
    logo: 'https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg',
    tag: 'Streaming Tech',
    color: 'hover:border-red-600/40 hover:shadow-red-600/10',
    badgeColor: 'bg-red-600/10 text-red-400',
  },
  {
    name: 'Apple',
    logo: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg',
    tag: 'Ecosystem',
    color: 'hover:border-gray-400/40 hover:shadow-gray-400/10',
    badgeColor: 'bg-gray-500/10 text-gray-300',
  },
  {
    name: 'Swiggy',
    logo: 'https://www.vectorlogo.zone/logos/swiggy/swiggy-icon.svg',
    tag: 'Hyperlocal Tech',
    color: 'hover:border-orange-500/40 hover:shadow-orange-500/10',
    badgeColor: 'bg-orange-500/10 text-orange-400',
  },
  {
    name: 'Barclays',
    logo: 'https://www.vectorlogo.zone/logos/barclays/barclays-icon.svg',
    tag: 'Banking & FinTech',
    color: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
    badgeColor: 'bg-cyan-500/10 text-cyan-400',
  },
  {
    name: 'Cognizant',
    logo: 'https://www.vectorlogo.zone/logos/cognizant/cognizant-icon.svg',
    tag: 'Enterprise IT',
    color: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
    badgeColor: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    name: 'Tech Mahindra',
    logo: 'https://www.vectorlogo.zone/logos/techmahindra/techmahindra-icon.svg',
    tag: 'Digital Solutions',
    color: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
    badgeColor: 'bg-rose-500/10 text-rose-400',
  },
  {
    name: 'Tesla',
    logo: 'https://www.vectorlogo.zone/logos/tesla/tesla-icon.svg',
    tag: 'Autopilot & EV',
    color: 'hover:border-red-500/40 hover:shadow-red-500/10',
    badgeColor: 'bg-red-500/10 text-red-400',
  },
];

const TopCompanies = ({ showHeader = true }) => {
  return (
    <section className="py-24 bg-[var(--color-bg)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">
                <Sparkles className="w-4 h-4" />
                Featured Employers
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                Top Companies Hiring Now
              </h2>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-purple-500 hover:text-white hover:bg-purple-600 text-sm font-bold transition-all group shadow-sm"
            >
              View all companies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="h-full"
            >
              <Link
                to={`/jobs?company=${encodeURIComponent(company.name)}`}
                title={`Explore open jobs at ${company.name}`}
                className={`group flex flex-col items-center justify-between p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md transition-all duration-300 ${company.color} hover:shadow-xl relative overflow-hidden h-full cursor-pointer text-center`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center p-2.5 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-full max-w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-purple-500">
                    <Building className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <h3 className="text-sm font-extrabold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors">
                    {company.name}
                  </h3>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${company.badgeColor}`}>
                    {company.tag}
                  </span>
                </div>

                <div className="w-full pt-3 border-t border-[var(--color-border)]/50 flex items-center justify-center gap-1.5 text-xs font-bold text-purple-500 group-hover:text-purple-400">
                  <span>View Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;
