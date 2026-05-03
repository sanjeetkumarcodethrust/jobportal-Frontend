import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Video, MessageSquare } from 'lucide-react';

const Resources = () => {
  const resources = [
    { icon: FileText, title: 'Resume Templates', category: 'Guide', time: '5 min read' },
    { icon: BookOpen, title: 'Interview Preparation', category: 'Course', time: '12 modules' },
    { icon: Video, title: 'Webinars & Events', category: 'Live', time: 'Weekly' },
    { icon: MessageSquare, title: 'Career Blog', category: 'Article', time: 'New daily' },
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
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Resources</span>
          </motion.h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Everything you need to boost your professional skills and stay ahead in the competitive job market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-1 rounded-3xl bg-gradient-to-br from-[var(--color-border)] to-transparent hover:from-blue-500/50 transition-all duration-500"
            >
              <div className="p-8 rounded-[22px] bg-[var(--color-surface)] flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <res.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">{res.category}</span>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{res.title}</h3>
                  </div>
                </div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">
                  {res.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
