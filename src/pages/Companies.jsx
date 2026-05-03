import React from 'react';
import { motion } from 'framer-motion';
import TopCompanies from '../components/TopCompanies';

const Companies = () => {
  return (
    <div className="pt-24 min-h-[80vh] flex flex-col bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6"
        >
          Discover Great <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Companies</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto"
        >
          Explore top organizations hiring right now. Find your next workplace where you can grow, learn, and make an impact.
        </motion.p>
      </div>

      <TopCompanies showHeader={false} />

    </div>
  );
};

export default Companies;
