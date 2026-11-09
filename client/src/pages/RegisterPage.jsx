import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight, Eye, EyeOff, Briefcase, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password, role, preferredLanguage);
      if (user.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950 transition-colors">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-brand-500">AI</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-2">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join thousands of active students and educators on EduAI
          </p>
        </div>

        {/* Register Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                I am registering as a:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    role === 'student'
                      ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    role === 'teacher'
                      ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Teacher / Faculty</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('fullName')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jasur Aliev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jasur@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Interface Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('preferredLanguage')}
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="en">English (US)</option>
                  <option value="uz">O'zbek tili</option>
                  <option value="ru">Русский язык</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : t('getStartedFree')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
