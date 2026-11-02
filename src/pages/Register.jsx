import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Building2,
  Users,
  ArrowRight,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Criteria checks for password
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);

  const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=';

    // Ensure at least 1 of each required category
    const required = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    // Total 8 characters
    const all = uppercase + lowercase + numbers + symbols;
    while (required.length < 8) {
      required.push(all[Math.floor(Math.random() * all.length)]);
    }

    // Shuffle characters
    const generated = required.sort(() => Math.random() - 0.5).join('');
    setFormData((prev) => ({ ...prev, password: generated }));
    setShowPassword(true);
  };

  const handleCopyPassword = () => {
    if (!formData.password) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
                  onClick={() => setFormData({ ...formData, role: 'candidate' })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    formData.role === 'candidate'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-500'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-purple-500/50'
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'recruiter' })}
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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
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
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[var(--color-text-primary)]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-400 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Strong Password
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-20 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-2 focus:ring-purple-500/50 transition-all sm:text-sm font-mono"
                    placeholder="e.g. K7#mP9$x"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    {formData.password && (
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-purple-500 transition-colors"
                        title="Copy password"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-purple-500 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1.5 text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      {hasMinLength ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      )}
                      <span className={hasMinLength ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}>
                        At least 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      {hasUpper ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      )}
                      <span className={hasUpper ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}>
                        1 Capital letter (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      {hasLower ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      )}
                      <span className={hasLower ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}>
                        1 Small letter (a-z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      {hasSymbol ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      )}
                      <span className={hasSymbol ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}>
                        1 Special symbol (!@#$%^&*...)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      {hasNumber ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      )}
                      <span className={hasNumber ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}>
                        1 Number (0-9)
                      </span>
                    </div>
                  </motion.div>
                )}
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
