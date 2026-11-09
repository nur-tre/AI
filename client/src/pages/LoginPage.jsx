import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, User, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
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
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your intelligent learning journey
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3.5 rounded-2xl bg-brand-50/70 dark:bg-navy-900 border border-brand-200/80 dark:border-brand-900/60 shadow-xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Account Sign-in:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('student@eduai.com', 'Student123!')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 dark:hover:border-brand-500 transition-colors flex items-center justify-center space-x-1"
            >
              <User className="w-3 h-3 text-blue-500" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('teacher@eduai.com', 'Teacher123!')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 dark:hover:border-brand-500 transition-colors flex items-center justify-center space-x-1"
            >
              <Briefcase className="w-3 h-3 text-emerald-500" />
              <span>Teacher</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@eduai.com', 'Admin123!')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 dark:hover:border-brand-500 transition-colors flex items-center justify-center space-x-1"
            >
              <Shield className="w-3 h-3 text-rose-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : t('login')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
