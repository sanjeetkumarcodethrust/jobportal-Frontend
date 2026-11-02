import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const emailToUse = (customEmail !== undefined ? customEmail : email).trim();
    const passwordToUse = customPassword !== undefined ? customPassword : password;

    if (!emailToUse || !passwordToUse) {
      setError('Please provide email and password');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        email: emailToUse,
        password: passwordToUse,
      });
      const { token, ...userData } = res.data;
      login(userData, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[var(--color-bg)] transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-sm"
      >
        <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-[var(--color-text-secondary)]">
          Enter your details to access your account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
      >
        <div className="bg-[var(--color-surface)] p-8 rounded-3xl shadow-xl border border-[var(--color-border)] backdrop-blur-xl">
          <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center space-y-2"
              >
                <p>{error}</p>
                {error.toLowerCase().includes('register') && (
                  <Link
                    to="/register"
                    className="inline-block px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                  >
                    Go to Register
                  </Link>
                )}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
              >
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Access */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Quick Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('candidate@jobportal.com');
                  setPassword('password123');
                  handleLogin(null, 'candidate@jobportal.com', 'password123');
                }}
                disabled={isSubmitting}
                className="py-3 px-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-purple-500/50 text-xs font-bold text-[var(--color-text-primary)] hover:text-purple-500 transition-all flex flex-col items-center gap-1 shadow-sm"
              >
                <span>Candidate Demo</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-normal">Job Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('recruiter@jobportal.com');
                  setPassword('password123');
                  handleLogin(null, 'recruiter@jobportal.com', 'password123');
                }}
                disabled={isSubmitting}
                className="py-3 px-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-purple-500/50 text-xs font-bold text-[var(--color-text-primary)] hover:text-purple-500 transition-all flex flex-col items-center gap-1 shadow-sm"
              >
                <span>Recruiter Demo</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-normal">Hiring Manager</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-purple-500 hover:text-purple-400">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
