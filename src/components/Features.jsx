import { Zap, ShieldCheck, BarChart3, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Lightning Fast',
    description: 'Quick and easy job applications',
    icon: Zap,
    color: 'from-blue-600/20 to-blue-400/20',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Verified Companies',
    description: '100% verified company profiles',
    icon: ShieldCheck,
    color: 'from-cyan-600/20 to-cyan-400/20',
    iconColor: 'text-cyan-400',
  },
  {
    title: 'Smart Matching',
    description: 'AI-powered job recommendations',
    icon: BarChart3,
    color: 'from-indigo-600/20 to-indigo-400/20',
    iconColor: 'text-indigo-400',
  },
  {
    title: 'Career Growth',
    description: 'Resources to boost your career',
    icon: GraduationCap,
    color: 'from-purple-600/20 to-purple-400/20',
    iconColor: 'text-purple-400',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-[var(--color-bg)] relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.description}</p>
              
              {/* Subtle Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-300 pointer-events-none rounded-3xl`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
