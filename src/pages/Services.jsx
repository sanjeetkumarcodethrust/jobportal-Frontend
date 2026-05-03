import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Globe, Zap, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    { icon: Zap, title: 'Priority Applicant', desc: 'Get your application highlighted to recruiters and stand out from the crowd.' },
    { icon: Globe, title: 'International Opportunities', desc: 'Find remote or on-site jobs across the globe with our global network.' },
    { icon: Shield, title: 'Verified Profiles', desc: 'Get a blue tick on your profile to build trust with top employers.' },
    { icon: Headphones, title: 'Career Coaching', desc: 'Connect with industry experts for personalized resume reviews and interview prep.' },
  ];

  return (
    <div className="pt-24 min-h-[80vh] bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6"
          >
            Our Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Services</span>
          </motion.h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Take your career to the next level with our curated services designed to help you land your dream job faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <service.icon className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{service.title}</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
