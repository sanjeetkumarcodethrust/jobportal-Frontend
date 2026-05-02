import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, Users, MessageSquare, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { 
      label: user?.role === 'recruiter' ? 'Active Listings' : 'Applied Jobs', 
      value: '12', 
      icon: Briefcase,
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-500'
    },
    { 
      label: user?.role === 'recruiter' ? 'Total Applications' : 'Saved Jobs', 
      value: '48', 
      icon: user?.role === 'recruiter' ? Users : TrendingUp,
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-500'
    },
    { 
      label: 'Messages', 
      value: '3', 
      icon: MessageSquare,
      color: 'from-pink-500/20 to-pink-600/20',
      textColor: 'text-pink-500'
    },
  ];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pt-32 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:flex md:items-center md:justify-between mb-12"
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Welcome back, <span className="text-purple-500">{user?.name || 'User'}</span>
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)] flex items-center gap-2">
              Current Role: 
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-500 ring-1 ring-inset ring-purple-500/20 uppercase tracking-widest">
                {user?.role || 'Guest'}
              </span>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[var(--color-surface)] p-8 rounded-[32px] border border-[var(--color-border)] shadow-xl backdrop-blur-xl relative overflow-hidden group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
              </div>
              <dt className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                {stat.label}
              </dt>
              <dd className="text-4xl font-extrabold text-[var(--color-text-primary)]">
                {stat.value}
              </dd>
              
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--color-surface)] rounded-[40px] p-10 border border-[var(--color-border)] shadow-2xl backdrop-blur-xl"
        >
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Recent Activity</h3>
          <div className="space-y-4">
             {/* Placeholder for actual activity feed */}
             {[1, 2, 3].map((_, i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-purple-500/30 transition-all cursor-pointer">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">Application viewed by Microsoft</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">2 hours ago</p>
                 </div>
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
