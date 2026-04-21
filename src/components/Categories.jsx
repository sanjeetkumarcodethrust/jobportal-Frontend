import { motion } from 'framer-motion';
import {
  Wifi,
  Building,
  BarChart3,
  FolderKanban,
  BrainCircuit,
  Wrench,
  TrendingUp,
  GraduationCap,
  Rocket,
  Users,
} from 'lucide-react';

const CATEGORIES = [
  { icon: Wifi, title: 'Remote', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' },
  { icon: Building, title: 'MNC', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400' },
  { icon: BarChart3, title: 'Analytics', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400' },
  { icon: FolderKanban, title: 'Project Mgmt', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400' },
  { icon: BrainCircuit, title: 'Data Science', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400' },
  { icon: Wrench, title: 'Engineering', gradient: 'from-sky-500 to-cyan-600', bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-600 dark:text-sky-400' },
  { icon: TrendingUp, title: 'Sales', gradient: 'from-lime-500 to-green-600', bg: 'bg-lime-50 dark:bg-lime-950/30', text: 'text-lime-600 dark:text-lime-400' },
  { icon: GraduationCap, title: 'Fresher', gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400' },
  { icon: Rocket, title: 'Startup', gradient: 'from-fuchsia-500 to-pink-600', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  { icon: Users, title: 'HR', gradient: 'from-teal-500 to-emerald-600', bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-600 dark:text-teal-400' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const Categories = () => {
  return (
    <section id="categories-section" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore by{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Browse jobs across popular categories and find the perfect role for your career
          </p>
        </motion.div>

        {/* ── Cards Grid ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
        >
          {CATEGORIES.map(({ icon: Icon, title, gradient, bg, text }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative cursor-pointer"
              id={`category-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="relative bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6 sm:p-7 text-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-gray-200/50 dark:group-hover:shadow-black/20 group-hover:border-transparent overflow-hidden">
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-300 rounded-2xl`} />

                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${bg} rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${text} transition-transform duration-300`} />
                </div>

                {/* Title */}
                <h3 className="relative text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
