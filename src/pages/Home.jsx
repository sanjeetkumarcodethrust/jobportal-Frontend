import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { motion } from 'framer-motion';
import { Building, Users, FileText, Award } from 'lucide-react';

const STATS = [
  { icon: Building, value: '10,000+', label: 'Companies Hiring', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  { icon: Users, value: '5 Lakh+', label: 'Active Jobs', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { icon: FileText, value: '2 Crore+', label: 'Resumes', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { icon: Award, value: '50 Lakh+', label: 'Placements', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/30' },
];

const Home = () => {
  return (
    <div className="bg-[var(--color-bg)]">
      <Hero />

      {/* ── Stats Section ─── */}
      <section id="stats-section" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {STATS.map(({ icon: Icon, value, label, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <div className={`text-xl sm:text-2xl font-extrabold ${color}`}>{value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Categories />

      {/* ── CTA Banner ─── */}
      <section id="cta-section" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-10 sm:p-14 lg:p-16 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                Ready to take the next step?
              </h2>
              <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
                Create your free account today and get matched with top companies looking for talent like you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/register"
                  id="cta-register"
                  className="inline-flex items-center px-8 py-3.5 text-sm font-bold bg-white text-indigo-700 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started — It's Free
                </a>
                <a
                  href="/register?role=recruiter"
                  id="cta-employer"
                  className="inline-flex items-center px-8 py-3.5 text-sm font-bold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  I'm an Employer
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
