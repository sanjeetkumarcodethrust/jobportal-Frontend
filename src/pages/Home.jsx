import Hero from '../components/Hero';
import Features from '../components/Features';
import TopCompanies from '../components/TopCompanies';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-[#030712] min-h-screen">
      {/* ── Hero Section ─── */}
      <Hero />

      {/* ── Features Section ─── */}
      <Features />

      {/* ── Top Companies Section ─── */}
      <TopCompanies />

      {/* ── CTA Section (Optional but good for premium feel) ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-white/10 overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)]" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to land your <br /> dream job?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of professionals who have already found their next career move with jobsearch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all hover:scale-[1.02]">
                Get Started Now
              </button>
              <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
