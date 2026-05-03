import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building2, Users, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/register', formData);
      const { token, ...userData } = res.data;
      login(userData, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[var(--color-bg)] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Join JobSearch
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          The #1 platform for dream jobs and top talent
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-[var(--color-surface)] p-8 rounded-3xl shadow-xl border border-[var(--color-border)] backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-4">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'jobseeker'})}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    formData.role === 'jobseeker' 
                    ? 'border-purple-500 bg-purple-500/10 text-purple-500' 
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-purple-500/50'
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'recruiter'})}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    formData.role === 'recruiter' 
                    ? 'border-purple-500 bg-purple-500/10 text-purple-500' 
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-purple-500/50'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Recruiter</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-purple-500 hover:text-purple-400">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
