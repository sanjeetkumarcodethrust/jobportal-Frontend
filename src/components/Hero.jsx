import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Star, Building2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

const Hero = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Find Jobs');

  const handleSearch = (searchData) => {
    const params = new URLSearchParams();
    if (searchData.skills) params.append('skills', searchData.skills);
    if (searchData.experience) params.append('experience', searchData.experience);
    if (searchData.location) params.append('location', searchData.location);
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
        <div className="relative">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 mb-6 relative z-20">
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
          <SearchBar onSearch={handleSearch} />
        </div>
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
