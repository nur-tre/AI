import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  Sparkles, 
  Menu, 
  X,
  ChevronDown,
  Shield,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenSearch, onOpenNotifications, unreadCount = 0 }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-brand-700 dark:from-white dark:to-brand-300 bg-clip-text text-transparent">
                  Edu<span className="text-brand-500">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 -mt-1">
                  Intelligent Learning
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (for desktop) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/courses"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith('/courses')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('courses')}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/tutor"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                    location.pathname === '/tutor'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span>{t('aiTutor')}</span>
                </Link>

                <Link
                  to="/quizzes"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/quizzes')
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('quizzes')}
                </Link>

                <Link
                  to="/planner"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/planner'
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('planner')}
                </Link>
              </>
            )}

            {/* Quick Search Shortcut Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors ml-2"
              title="Global Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Controls: Language, Theme, Notifications, User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setUserMenuOpen(false);
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Language selector"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline uppercase font-bold text-[11px]">{currentLangObj.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        changeLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                        lang === item.code
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-base">{item.flag}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle color theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Trigger (for logged in users) */}
            {isAuthenticated && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-navy-900 animate-pulse" />
                )}
              </button>
            )}

            {/* User Profile or Login/Register buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setLangMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-brand-500/30 transition-all"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-1.5 flex items-center space-x-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
                          {user?.role}
                        </span>
                        {user?.level && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                            Lvl {user?.level}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-500" />
                        <span>{t('dashboard')}</span>
                      </Link>

                      {user?.role === 'teacher' && (
                        <Link
                          to="/teacher"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <Briefcase className="w-4 h-4 text-emerald-500" />
                          <span>{t('teacherPanel')}</span>
                        </Link>
                      )}

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <Shield className="w-4 h-4 text-rose-500" />
                          <span>{t('adminPanel')}</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <User className="w-4 h-4 text-indigo-500" />
                        <span>{t('profile')}</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/25 transition-all hover:shadow-brand-500/40 hover:-translate-y-0.5"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-navy-900">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t('courses')}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('dashboard')}
              </Link>
              <Link
                to="/tutor"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('aiTutor')}
              </Link>
              <Link
                to="/quizzes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('quizzes')}
              </Link>
              <Link
                to="/planner"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('planner')}
              </Link>
              <Link
                to="/flashcards"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('flashcards')}
              </Link>
              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('documents')}
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('leaderboard')}
              </Link>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-lg"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium bg-brand-600 text-white rounded-lg"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
