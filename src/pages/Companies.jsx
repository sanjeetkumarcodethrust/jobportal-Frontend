import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Building, ArrowRight, MapPin, Users, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ALL_COMPANIES = [
  {
    name: 'Google',
    logo: 'https://www.vectorlogo.zone/logos/google/google-icon.svg',
    industry: 'Cloud & AI',
    category: 'Tech Giants',
    location: 'Bengaluru, Hyderabad',
    openRoles: '2+ Open Roles',
    rating: 4.8,
    reviews: '12K+ reviews',
    featured: true,
    description: 'World-leading technology enterprise organizing global information and developing cutting-edge AI and cloud platforms.',
  },
  {
    name: 'Microsoft',
    logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
    industry: 'Cloud & Enterprise',
    category: 'Tech Giants',
    location: 'Hyderabad, Bengaluru, Noida',
    openRoles: '2+ Open Roles',
    rating: 4.7,
    reviews: '18K+ reviews',
    featured: true,
    description: 'Empowering every person and organization on the planet to achieve more through Azure, Office, and AI breakthroughs.',
  },
  {
    name: 'Amazon',
    logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg',
    industry: 'E-Commerce & AWS',
    category: 'Tech Giants',
    location: 'Bengaluru, Hyderabad, Chennai',
    openRoles: '4+ Open Roles',
    rating: 4.6,
    reviews: '24K+ reviews',
    featured: true,
    description: 'Customer-obsessed global innovator leading cloud computing with AWS and world-class retail logistics.',
  },
  {
    name: 'Uber',
    logo: 'https://www.vectorlogo.zone/logos/uber/uber-icon.svg',
    industry: 'Mobility & Logistics',
    category: 'Logistics & Mobility',
    location: 'Hyderabad, Bengaluru, London',
    openRoles: '33+ Open Roles',
    rating: 4.5,
    reviews: '8K+ reviews',
    featured: true,
    description: 'Igniting opportunity by setting the world in motion with ridesharing, freight, and food delivery networks.',
  },
  {
    name: 'Meta',
    logo: 'https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg',
    industry: 'Social & AI Infrastructure',
    category: 'Tech Giants',
    location: 'Gurugram, Bengaluru, Remote',
    openRoles: '1+ Open Roles',
    rating: 4.6,
    reviews: '10K+ reviews',
    featured: true,
    description: 'Building connection technologies and AI models that give people the power to build community and bring the world closer.',
  },
  {
    name: 'Netflix',
    logo: 'https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg',
    industry: 'Streaming Entertainment',
    category: 'Tech Giants',
    location: 'Mumbai, Remote',
    openRoles: '1+ Open Roles',
    rating: 4.8,
    reviews: '4K+ reviews',
    featured: true,
    description: 'Streaming entertainment pioneer entertaining hundreds of millions of subscribers across the globe with original stories.',
  },
  {
    name: 'Apple',
    logo: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg',
    industry: 'Consumer Technology',
    category: 'Tech Giants',
    location: 'Hyderabad, Bengaluru',
    openRoles: '1+ Open Roles',
    rating: 4.8,
    reviews: '15K+ reviews',
    featured: true,
    description: 'Creating transformative user experiences across hardware, software, and silicon engineering.',
  },
  {
    name: 'Barclays',
    logo: 'https://www.vectorlogo.zone/logos/barclays/barclays-icon.svg',
    industry: 'Banking & FinTech',
    category: 'FinTech & Banking',
    location: 'Pune, Maharashtra',
    openRoles: '1+ Open Roles',
    rating: 4.4,
    reviews: '9K+ reviews',
    featured: false,
    description: 'Transatlantic consumer and wholesale bank offering wealth management, corporate banking, and FinTech innovation.',
  },
  {
    name: 'Swiggy',
    logo: 'https://www.vectorlogo.zone/logos/swiggy/swiggy-icon.svg',
    industry: 'Food & Quick Commerce',
    category: 'Logistics & Mobility',
    location: 'Bengaluru, Karnataka',
    openRoles: '1+ Open Roles',
    rating: 4.5,
    reviews: '6K+ reviews',
    featured: false,
    description: 'India’s pioneering on-demand convenience platform connecting consumers to food, groceries, and dining experiences.',
  },
  {
    name: 'Cognizant',
    logo: 'https://www.vectorlogo.zone/logos/cognizant/cognizant-icon.svg',
    industry: 'IT Services & Consulting',
    category: 'IT Services',
    location: 'Pune, Chennai, Kolkata',
    openRoles: '2+ Open Roles',
    rating: 4.3,
    reviews: '30K+ reviews',
    featured: false,
    description: 'Transforming clients’ business, operating, and technology models for the modern digital era.',
  },
  {
    name: 'Tech Mahindra',
    logo: 'https://www.vectorlogo.zone/logos/techmahindra/techmahindra-icon.svg',
    industry: 'Digital Transformation',
    category: 'IT Services',
    location: 'Pune, Hyderabad, Noida',
    openRoles: '1+ Open Roles',
    rating: 4.2,
    reviews: '22K+ reviews',
    featured: false,
    description: 'Leading digital transformation and business re-engineering services for global enterprises.',
  },
  {
    name: 'CRED',
    logo: 'https://www.vectorlogo.zone/logos/cred/cred-icon.svg',
    industry: 'FinTech Platform',
    category: 'FinTech & Banking',
    location: 'Bengaluru, Karnataka',
    openRoles: '1+ Open Roles',
    rating: 4.6,
    reviews: '3K+ reviews',
    featured: false,
    description: 'Members-only club that rewards creditworthy individuals with exclusive financial privileges and premium experiences.',
  },
  {
    name: 'Tesla',
    logo: 'https://www.vectorlogo.zone/logos/tesla/tesla-icon.svg',
    industry: 'Automotive & AI',
    category: 'Tech Giants',
    location: 'Pune, Bengaluru',
    openRoles: '1+ Open Roles',
    rating: 4.5,
    reviews: '7K+ reviews',
    featured: false,
    description: 'Accelerating the world’s transition to sustainable energy with electric vehicles, solar, and autonomous software.',
  },
  {
    name: 'Zomato',
    logo: 'https://www.vectorlogo.zone/logos/zomato/zomato-icon.svg',
    industry: 'Food Delivery & Tech',
    category: 'Logistics & Mobility',
    location: 'Gurugram, Haryana',
    openRoles: '1+ Open Roles',
    rating: 4.4,
    reviews: '11K+ reviews',
    featured: false,
    description: 'Connecting food lovers with the best restaurants, dining guides, and rapid grocery deliveries through Blinkit.',
  },
  {
    name: 'IBM',
    logo: 'https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg',
    industry: 'Hybrid Cloud & AI',
    category: 'IT Services',
    location: 'Bengaluru, Kochi',
    openRoles: '1+ Open Roles',
    rating: 4.4,
    reviews: '25K+ reviews',
    featured: false,
    description: 'Integrating technology and business expertise to invent what is next in hybrid cloud, quantum computing, and AI.',
  },
  {
    name: 'Flipkart',
    logo: 'https://www.vectorlogo.zone/logos/flipkart/flipkart-icon.svg',
    industry: 'E-Commerce Marketplace',
    category: 'Logistics & Mobility',
    location: 'Bengaluru, Karnataka',
    openRoles: '1+ Open Roles',
    rating: 4.5,
    reviews: '14K+ reviews',
    featured: false,
    description: 'Pioneering Indian e-commerce with seamless shopping, supply chain innovation, and cutting-edge logistics.',
  },
];

const CATEGORIES = [
  'All',
  'Tech Giants',
  'FinTech & Banking',
  'Logistics & Mobility',
  'IT Services',
];

const Companies = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCompanies = useMemo(() => {
    return ALL_COMPANIES.filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(search.toLowerCase()) ||
        comp.industry.toLowerCase().includes(search.toLowerCase()) ||
        comp.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || comp.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[var(--color-bg)] transition-colors duration-500">
      {/* ─── Hero Section ─── */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 dark:bg-purple-600/15 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-purple-500 mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Top Employers & Verified Workplaces</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-6"
          >
            Explore Great <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              Companies Hiring
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Click any company below to instantly view their open jobs, salaries, and application requirements.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-2xl mx-auto relative mb-8"
          >
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] focus-within:border-purple-500 shadow-xl transition-all">
              <Search className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name, industry, or city..."
                className="w-full bg-transparent outline-none text-sm text-[var(--color-text-primary)]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-[var(--color-text-muted)] hover:text-purple-500 font-bold px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-purple-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Companies Grid ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Showing <span className="text-[var(--color-text-primary)] font-bold">{filteredCompanies.length}</span> companies hiring now
          </p>
          <span className="text-xs text-[var(--color-text-muted)]">
            Click any company card to view its open positions
          </span>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
            <Building className="w-12 h-12 text-purple-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No companies match your search</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Try adjusting your search terms or clearing the selected category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}`)}
                className="p-7 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center p-3 group-hover:scale-105 transition-transform shadow-inner">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-purple-500">
                        <Building className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {company.openRoles}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-purple-500 transition-colors">
                        {company.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
                        {company.industry}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-[var(--color-text-primary)]">{company.rating}</span>
                        <span className="text-[var(--color-text-muted)]">({company.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-500/70" />
                        <span>{company.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed pt-2">
                      {company.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Direct hiring partner
                  </span>
                  <Link
                    to={`/jobs?company=${encodeURIComponent(company.name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-400 group/btn transition-colors"
                  >
                    View Jobs
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Companies;
