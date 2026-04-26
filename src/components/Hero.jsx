import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Sparkles, TrendingUp, Star, Building2, Users, Briefcase } from 'lucide-react';
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

const Hero = () => {
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('Find Jobs');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (skills) params.append('skills', skills);
    if (experience) params.append('experience', experience);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { label: '5 Lakh+', sub: 'Jobs Available', icon: Search, color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400', pos: 'top-[20%] left-[5%]' },
    { label: '10K+', sub: 'Top Companies', icon: Building2, color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-400', pos: 'top-[25%] right-[10%]' },
    { label: '50 Lakh+', sub: 'Active Users', icon: Users, color: 'from-pink-500/20 to-pink-600/20', iconColor: 'text-pink-400', pos: 'bottom-[25%] right-[5%]' },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[var(--color-bg)] transition-colors duration-500">
      {/* ── Background Gradients ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/10 dark:bg-purple-600/15 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* ── Badge ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] mb-8 shadow-sm"
        >
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span>#1 Job Platform in India</span>
          <Star className="w-3 h-3 text-purple-500 fill-purple-500" />
        </motion.div>

        {/* ── Heading ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-6 leading-tight">
            Find your <br />
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              dream job
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover opportunities, build your career, and <br className="hidden md:block" /> work with the best companies
          </p>
        </motion.div>

        {/* ── Mobile/Tablet Stats ─── */}
        <div className="lg:hidden mt-8 mb-12 flex flex-wrap justify-center gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center gap-2 min-w-[100px]"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[var(--color-text-primary)] font-bold text-sm whitespace-nowrap">{stat.label}</span>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-medium whitespace-nowrap">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Search Container ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto bg-[var(--color-surface)] backdrop-blur-xl border border-[var(--color-border)] rounded-[32px] p-6 shadow-2xl relative z-10"
        >
          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 mb-8 border-b border-[var(--color-border)] pb-4">
            {['Find Jobs', 'Companies', 'Skills', 'Locations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors relative pb-4 ${
                  activeTab === tab ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab === 'Find Jobs' && <Search className="w-4 h-4" />}
                {tab === 'Companies' && <Building2 className="w-4 h-4" />}
                {tab === 'Skills' && <Sparkles className="w-4 h-4" />}
                {tab === 'Locations' && <MapPin className="w-4 h-4" />}
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
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
                className="px-4 py-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-purple-500/50 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Desktop Floating Stats (Section Level) ─── */}
      <div className="hidden lg:block">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`absolute flex flex-col items-center gap-3 ${stat.pos} z-0 pointer-events-none xl:pointer-events-auto`}
          >
            <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br ${stat.color} backdrop-blur-md border border-[var(--color-border)] flex items-center justify-center shadow-2xl`}>
              <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
            </div>
            <div className="flex flex-col items-center bg-[var(--color-surface)]/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-[var(--color-border)] shadow-xl">
              <span className="text-[var(--color-text-primary)] font-black text-2xl tracking-tight whitespace-nowrap">{stat.label}</span>
              <span className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest whitespace-nowrap">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
