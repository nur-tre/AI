import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Layers, 
  FileText, 
  Award, 
  Trophy, 
  Settings, 
  Flame, 
  Sparkles,
  Briefcase,
  Shield,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  const studentLinks = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/tutor', label: t('aiTutor'), icon: Bot, badge: 'AI' },
    { to: '/courses', label: t('courses'), icon: BookOpen },
    { to: '/quizzes', label: t('quizzes'), icon: CheckSquare },
    { to: '/planner', label: t('planner'), icon: Calendar },
    { to: '/flashcards', label: t('flashcards'), icon: Layers },
    { to: '/documents', label: t('documents'), icon: FileText },
    { to: '/leaderboard', label: t('leaderboard'), icon: Trophy },
    { to: '/profile', label: t('profile'), icon: Settings }
  ];

  const teacherLinks = [
    { to: '/teacher', label: t('teacherPanel'), icon: Briefcase },
    { to: '/courses', label: t('courses'), icon: BookOpen },
    { to: '/quizzes', label: t('quizzes'), icon: CheckSquare },
    { to: '/documents', label: t('documents'), icon: FileText },
    { to: '/profile', label: t('profile'), icon: Settings }
  ];

  const adminLinks = [
    { to: '/admin', label: t('adminPanel'), icon: Shield },
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/courses', label: t('courses'), icon: BookOpen },
    { to: '/quizzes', label: t('quizzes'), icon: CheckSquare },
    { to: '/profile', label: t('profile'), icon: Settings }
  ];

  const links = isAdmin ? adminLinks : isTeacher ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block bg-white/70 dark:bg-navy-900/70 border-r border-slate-200/80 dark:border-slate-800/80 p-4 min-h-[calc(100vh-4rem)] glass">
      
      {/* User Progress Glance */}
      {user && (
        <div className="mb-6 p-3 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 dark:from-navy-800 dark:to-slate-900 border border-brand-100/80 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center space-x-3 mb-2.5">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-brand-200 dark:border-slate-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="capitalize">{user.role}</span>
                <span>•</span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold">{user.xp || 0} XP</span>
              </div>
            </div>
          </div>

          {/* Daily Streak & Level Badges */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-brand-100 dark:border-slate-700/60 text-center">
            <div className="flex items-center justify-center space-x-1.5 py-1 px-2 rounded-lg bg-white/80 dark:bg-navy-900/80 border border-orange-200/60 dark:border-orange-900/40">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {user.streak || 1}d Streak
              </span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 py-1 px-2 rounded-lg bg-white/80 dark:bg-navy-900/80 border border-purple-200/60 dark:border-purple-900/40">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                Lvl {user.level || 1}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          {isAdmin ? 'Administration' : isTeacher ? 'Teaching Hub' : 'Learning Portal'}
        </p>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Quick AI Pro Tip Box */}
      <div className="mt-8 p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold mb-1">
          <Bot className="w-4 h-4" />
          <span>AI Study Tip</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          Generate flashcards right after completing a lesson to double retention rate!
        </p>
      </div>
    </aside>
  );
}
